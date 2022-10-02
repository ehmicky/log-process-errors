import logProcessErrors from 'log-process-errors'
import sinon from 'sinon'

// Call `logProcessErrors()` then return spied objects and `stopLogging()`
export const startLogging = function ({
  eventName,
  log,
  spy,
  exitOn = [],
} = {}) {
  const logA = getLog(log, spy, eventName)
  const stopLogging = logProcessErrors({ log: logA, exitOn })
  return { stopLogging, log: logA }
}

// Get `opts.log()`
const getLog = function (log, spy, eventName) {
  if (log === 'default') {
    return
  }

  const logFunc = logEvent.bind(undefined, { log, eventName })
  return spy ? sinon.spy(logFunc) : logFunc
}

const logEvent = function ({ log, eventName }, error, actualEventName) {
  if (
    log !== undefined &&
    (eventName === undefined || actualEventName === eventName)
  ) {
    log(error, actualEventName)
  }
}

export const startLoggingNoOpts = function () {
  const stopLogging = logProcessErrors()
  return { stopLogging }
}
