// The methods in this file trigger different types of process errors.
// This is done for example purposes.
'use strict'

const { emitWarning } = require('process')

// Emit an `uncaughtException` event
const uncaughtException = function () {
  setTimeout(() => {
    throw new Error('File not found')
  }, 0)
}

// Emit `unhandledRejection` and `rejectionHandled` events
const unhandledRejection = function () {
  const promise = Promise.reject(new Error('Invalid permission'))
  setTimeout(() => {
    // eslint-disable-next-line no-empty-function, max-nested-callbacks
    promise.catch(() => {})
  }, 0)
}

// Emit a `warning` event
const warning = function () {
  emitWarning('Invalid option', {
    type: 'DeprecationWarning',
    code: 'DeprecatedMethod',
    detail: 'opts.force is deprecated',
  })
}

// Emit a `multipleResolves` event
const multipleResolves = function () {
  // eslint-disable-next-line promise/avoid-new
  return new Promise((resolve, reject) => {
    resolve({ success: true })
    reject(new Error('Cannot send request'))
  })
}

module.exports = {
  uncaughtException,
  unhandledRejection,
  warning,
  multipleResolves,
}
