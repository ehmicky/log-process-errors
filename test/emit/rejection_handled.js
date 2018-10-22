'use strict'

const { promisify } = require('util')

const { defaultGetError } = require('./default')

// Emit a `rejectionHandled` event
const rejectionHandled = async function(getError = defaultGetError) {
  const promise = Promise.reject(getError())

  await promisify(setImmediate)()

  // eslint-disable-next-line no-empty-function
  promise.catch(() => {})

  await promisify(setImmediate)()
}

module.exports = {
  rejectionHandled,
}
