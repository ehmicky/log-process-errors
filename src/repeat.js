'use strict'

const { stableSerialize } = require('./message/serialize')

// Events with the same `event` are only logged once because:
//  - it makes logs clearer
//  - it prevents creating too much CPU load or too many microtasks
//  - it prevents creating too many logs, which can be expensive if logs are
//    hosted remotely
//  - it prevents infinite recursions if `opts.log|level|message()` triggers
//    itself an event (while still reporting that event once)
const isRepeated = function({ event, previousEvents }) {
  const fingerprint = getFingerprint({ event })

  const isRepeatedEvent = previousEvents.has(fingerprint)

  if (!isRepeatedEvent) {
    previousEvents.add(fingerprint)
  }

  return isRepeatedEvent
}

// Serialize `event` into a short fingerprint
const getFingerprint = function({ event }) {
  const entries = EVENT_PROPS.map(propName =>
    serializeEntry({ event, propName }),
  )
  const eventA = Object.assign({}, ...entries)

  const fingerprint = JSON.stringify(eventA)

  // We truncate fingerprints to prevent consuming too much memory in case some
  // `event` properties are huge.
  // This introduces higher risk of false positives (see comment below).
  // We do not hash as it would be too CPU-intensive if the value is huge.
  const fingerprintA = fingerprint.slice(0, FINGERPRINT_MAX_LENGTH)
  return fingerprintA
}

// We do not serialize `event.name` since this is already `event.name-wise`
// Key order matters since fingerprint might be truncated: we serialize short
// and non-dynamic values first.
const EVENT_PROPS = ['nextRejected', 'rejected', 'nextValue', 'value']

const FINGERPRINT_MAX_LENGTH = 1e4

const serializeEntry = function({ event, propName }) {
  const value = event[propName]

  if (value === undefined) {
    return
  }

  const valueA = serializeValue({ value })
  return { [propName]: valueA }
}

const serializeValue = function({ value }) {
  if (value instanceof Error) {
    return serializeError(value)
  }

  return stableSerialize(value)
}

// We do not serialize `error.message` as it may contain dynamic values like
// timestamps. This means errors are only `error.name` + `error.stack`, which
// should be a good fingerprint.
// Also we only keep first 10 callsites in case of infinitely recursive stack.
const serializeError = function({ name, stack }) {
  const stackA = filterErrorStack({ stack })
  return `${name}\n${stackA}`
}

const filterErrorStack = function({ stack }) {
  return stack
    .split('\n')
    .filter(line => STACK_TRACE_LINE_REGEXP.test(line))
    .slice(0, STACK_TRACE_MAX_LENGTH)
    .join('\n')
}

const STACK_TRACE_LINE_REGEXP = /^\s+at /u
const STACK_TRACE_MAX_LENGTH = 10

module.exports = {
  isRepeated,
}
