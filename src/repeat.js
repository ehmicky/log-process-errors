import { inspect } from 'util'

import { isErrorInstance } from './error/check.js'

// Events with the same `event` are only logged once because:
//  - it makes logs clearer
//  - it prevents creating too much CPU load or too many microtasks
//  - it prevents creating too many logs, which can be expensive if logs are
//    hosted remotely
//  - it prevents infinite recursions if `opts.log()` triggers itself an event
//    (while still reporting that event once)
export const isRepeated = function (value, previousEvents) {
  const fingerprint = getFingerprint(value)

  const isRepeatedEvent = previousEvents.has(fingerprint)

  if (!isRepeatedEvent) {
    previousEvents.add(fingerprint)
  }

  return isRepeatedEvent
}

// Serialize `event` into a short fingerprint.
// We truncate fingerprints to prevent consuming too much memory in case some
// `event` properties are huge.
// This introduces higher risk of false positives (see comment below).
// We do not hash as it would be too CPU-intensive if the value is huge.
const getFingerprint = function (value) {
  const fingerprint = isErrorInstance(value)
    ? serializeError(value)
    : stableSerialize(value)
  return fingerprint.slice(0, FINGERPRINT_MAX_LENGTH)
}

// We do not serialize `error.message` as it may contain dynamic values like
// timestamps. This means errors are only `error.name` + `error.stack`, which
// should be a good fingerprint.
// Also we only keep first 10 call sites in case of infinitely recursive stack.
const serializeError = function ({ name, stack }) {
  const stackA = filterErrorStack(stack)
  return `${name}\n${stackA}`
}

const filterErrorStack = function (stack) {
  return stack
    .split('\n')
    .filter(isStackLine)
    .slice(0, STACK_TRACE_MAX_LENGTH)
    .join('\n')
}

const isStackLine = function (line) {
  return STACK_TRACE_LINE_REGEXP.test(line)
}

const STACK_TRACE_LINE_REGEXP = /^\s+at /u
const STACK_TRACE_MAX_LENGTH = 10

// This is meant when serialization must be predictable.
// We use `util.inspect()` instead of `JSON.stringify()` to support more
// types and circular references.
// `sorted` prevents the same event using different keys order from having
// a different fingerprint.
// Big arrays, objects or buffers will be truncated, which makes this call
// less CPU-intensive and the result value smaller in memory. However it
// introduces higher risk of false positives (event being flagged as repeated
// even though it's different). Process errors should be exceptional, so this
// is ok.
const stableSerialize = function (value) {
  return inspect(value, INSPECT_OPTS)
}

const INSPECT_OPTS = { getters: true, sorted: true }

const FINGERPRINT_MAX_LENGTH = 1e4
