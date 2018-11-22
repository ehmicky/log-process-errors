'use strict'

const { promisify } = require('util')

const { defaultGetError } = require('./default')

// Emit an `unhandledRejection` event
const unhandledRejection = async function(getError = defaultGetError) {
  // eslint-disable-next-line promise/catch-or-return
  Promise.reject(getError())

  await promisify(setImmediate)()
}

module.exports = {
  unhandledRejection,
}
