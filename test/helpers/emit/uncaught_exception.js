'use strict'

const { nextTick } = require('process')
const { promisify } = require('util')

const pSetImmediate = promisify(setImmediate)

// Emit an `uncaughtException` event
const uncaughtException = async function() {
  nextTick(() => {
    throw new Error('message')
  })

  await pSetImmediate()
  await pSetImmediate()
}

module.exports = {
  uncaughtException,
}
