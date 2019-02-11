'use strict'

const { nextTick } = require('process')

const promisify = require('util.promisify')

const { defaultGetError } = require('./default')

const pSetImmediate = promisify(setImmediate)

// Emit an `uncaughtException` event
const uncaughtException = async function(getError = defaultGetError) {
  nextTick(() => {
    throw getError()
  })

  await pSetImmediate()
  await pSetImmediate()
}

module.exports = {
  uncaughtException,
}
