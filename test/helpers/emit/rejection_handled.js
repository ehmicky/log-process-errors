'use strict'

const { promisify } = require('util')

const pSetImmediate = promisify(setImmediate)

// Emit a `rejectionHandled` event
const rejectionHandled = async function() {
  const promise = Promise.reject(new Error('message'))

  await pSetImmediate()
  await pSetImmediate()

  // eslint-disable-next-line no-empty-function
  promise.catch(() => {})

  await pSetImmediate()
  await pSetImmediate()
}

module.exports = {
  rejectionHandled,
}
