'use strict'

// We need to mock `Error.stack` since it's host-dependent
const stubStackTrace = function() {
  setPrepareStackTrace(prepareStackTraceMock)
}

const prepareStackTraceMock = function({ message }) {
  return `Error: ${message}\n    at STACK TRACE`
}

// Make `Error.stack` random for testing
const stubStackTraceRandom = function() {
  setPrepareStackTrace(prepareStackTraceRandom)
}

const prepareStackTraceRandom = function({ message }) {
  return `Error: ${message}\n    at ${Math.random()}`
}

const unstubStackTrace = function() {
  setPrepareStackTrace(prepareStackTraceOrig)
}

const prepareStackTraceOrig = Error.prepareStackTrace

const setPrepareStackTrace = function(prepareStackTrace) {
  // eslint-disable-next-line fp/no-mutation
  Error.prepareStackTrace = prepareStackTrace
}

module.exports = {
  stubStackTrace,
  stubStackTraceRandom,
  unstubStackTrace,
}
