'use strict'

const { stableSerialize } = require('./serialize')

// Events with the same `info` are only logged once because:
//  - it makes logs clearer
//  - it prevents creating too much CPU load or too many microtasks
//  - it prevents creating too many logs, which can be expensive if logs are
//    hosted remotely
//  - it prevents infinite recursions if
//    `opts.log|getLevel|getMessage|skipEvent()` triggers itself an event
//    (while still reporting that event once)
const isRepeated = function({ info, previousEvents }) {
  const fingerprint = getFingerprint({ info })

  const isRepeatedEvent = previousEvents.has(fingerprint)

  if (!isRepeatedEvent) {
    previousEvents.add(fingerprint)
  }

  return isRepeatedEvent
}

// Serialize `info` into a short fingerprint
const getFingerprint = function({ info }) {
  const entries = INFO_PROPS.map(propName => serializeEntry({ info, propName }))
  const infoA = Object.assign({}, ...entries)

  const fingerprint = JSON.stringify(infoA)

  // We truncate fingerprints to prevent consuming too much memory in case some
  // `info` properties are huge.
  // This introduces higher risk of false positives (see comment below).
  // We do not hash as it would be too CPU-intensive if the value is huge.
  const fingerprintA = fingerprint.slice(0, FINGERPRINT_MAX_LENGTH)
  return fingerprintA
}

// We do not serialize `info.eventName` since this is already `eventName-wise`
// Key order matters since fingerprint might be truncated: we serialize short
// and non-dynamic values first.
const INFO_PROPS = [
  'secondPromiseState',
  'promiseState',
  'error',
  'secondPromiseValue',
  'promiseValue',
]

const FINGERPRINT_MAX_LENGTH = 1e4

const serializeEntry = function({ info, propName }) {
  const value = info[propName]

  if (value === undefined) {
    return
  }

  const valueA = serializeValue({ value })
  return { [propName]: valueA }
}

const serializeValue = function({ value }) {
  if (value instanceof Error) {
    return serializeError({ error: value })
  }

  return stableSerialize(value)
}

// We do not serialize `error.message` as it may contain dynamic values like
// timestamps. This means errors are only `error.name` + `error.stack`, which
// should be a good fingerprint.
// Also we only keep first 10 callsites in case of infinitely recursive stack.
const serializeError = function({ error: { name, stack } }) {
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
