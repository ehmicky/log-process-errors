import logProcessErrors from 'log-process-errors'
import sinon from 'sinon'

export const startLogging = function (opts) {
  const onError = sinon.spy()
  const stopLogging = logProcessErrors({ onError, exit: false, ...opts })
  return { onError, stopLogging }
}
