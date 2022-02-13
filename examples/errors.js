// The methods in this file trigger different types of process errors.
// This is done for example purposes.
import { emitWarning } from 'process'

// Emit an `uncaughtException` event
export const uncaughtException = function () {
  setTimeout(() => {
    throw new Error('File not found')
  }, 0)
}

// Emit `unhandledRejection` and `rejectionHandled` events
export const unhandledRejection = function () {
  const promise = Promise.reject(new Error('Invalid permission'))
  setTimeout(() => {
    // eslint-disable-next-line promise/prefer-await-to-then, max-nested-callbacks
    promise.catch(() => {})
  }, 0)
}

// Emit a `warning` event
export const warning = function () {
  emitWarning('Invalid option', {
    type: 'DeprecationWarning',
    code: 'DeprecatedMethod',
    detail: 'opts.force is deprecated',
  })
}
