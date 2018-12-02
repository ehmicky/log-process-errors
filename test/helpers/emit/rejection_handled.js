'use strict'

const { promisify } = require('util')

const { defaultGetError } = require('./default')

const pSetImmediate = promisify(setImmediate)

// Emit a `rejectionHandled` event
const rejectionHandled = async function(getError = defaultGetError) {
  const promise = Promise.reject(getError())

  await promisify(setImmediate)()

  // eslint-disable-next-line no-empty-function
  promise.catch(() => {})

  await pSetImmediate()
  await pSetImmediate()
}

module.exports = {
  rejectionHandled,
}
