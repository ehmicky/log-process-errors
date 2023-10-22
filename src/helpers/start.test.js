import logProcessErrors from 'log-process-errors'
import { spy } from 'sinon'

export const startLogging = (opts) => {
  const onError = spy()
  const stopLogging = logProcessErrors({ onError, exit: false, ...opts })
  return { onError, stopLogging }
}
