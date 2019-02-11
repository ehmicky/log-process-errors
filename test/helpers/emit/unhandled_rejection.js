'use strict'

const promisify = require('util.promisify')

const { defaultGetError } = require('./default')

const pSetImmediate = promisify(setImmediate)

// Emit an `unhandledRejection` event
const unhandledRejection = async function(getError = defaultGetError) {
  // eslint-disable-next-line promise/catch-or-return
  Promise.reject(getError())

  await pSetImmediate()
}

module.exports = {
  unhandledRejection,
}
