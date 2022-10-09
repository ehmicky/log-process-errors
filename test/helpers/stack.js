// Make `Error.stack` random for testing
export const stubStackTraceRandom = function () {
  setPrepareStackTrace(prepareStackTraceRandom)
}

const prepareStackTraceRandom = function ({ message }) {
  return `Error: ${message}\n    at ${Math.random()}`
}

export const unstubStackTrace = function () {
  setPrepareStackTrace(prepareStackTraceOrig)
}

const prepareStackTraceOrig = Error.prepareStackTrace

const setPrepareStackTrace = function (prepareStackTrace) {
  // eslint-disable-next-line fp/no-mutation
  Error.prepareStackTrace = prepareStackTrace
}
