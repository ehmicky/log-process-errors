'use strict'

// Retrieve `error`
const getError = function({ error, promiseState, promiseValue }) {
  // `error` should always be defined for `uncaughtException` and `warning`.
  // The other events are promise-based, in which case it should only be defined
  // if the promise was rejected
  if (promiseState === 'resolved') {
    return
  }

  const errorA = promiseState === 'rejected' ? promiseValue : error

  // Throwing `undefined` (`uncaughtException`) or rejecting a promise with
  // `undefined` is improper, so we normalize it to an `Error` instance
  const errorB = errorA === undefined ? 'undefined' : errorA

  // Normalize error if it's not an `Error` (as it should)
  const errorC = new Error(`Error: ${errorB}`)
  return errorC
}

module.exports = {
  getError,
}
