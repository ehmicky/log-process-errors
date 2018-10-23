'use strict'

const { nextTick } = require('process')
const { promisify } = require('util')

const { defaultGetError } = require('./default')

// Emit an `uncaughtException` event
const uncaughtException = async function(getError = defaultGetError) {
  nextTick(() => {
    throw getError()
  })

  await promisify(setImmediate)()
}

module.exports = {
  uncaughtException,
}
