'use strict'

const { promisify } = require('util')

const pSetImmediate = promisify(setImmediate)

// Emit an `unhandledRejection` event
const unhandledRejection = async function() {
  // eslint-disable-next-line promise/catch-or-return
  Promise.reject(new Error('message'))

  await pSetImmediate()
}

module.exports = {
  unhandledRejection,
}
