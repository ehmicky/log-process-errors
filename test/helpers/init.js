'use strict'

const process = require('process')

const { EVENTS } = require('./emit')

// Ava sets up process `uncaughtException` and `unhandledRejection` handlers
// which makes testing them harder.
const removeProcessListeners = function() {
  Object.keys(EVENTS).forEach(eventName =>
    process.removeAllListeners(eventName),
  )
}

removeProcessListeners()

module.exports = {}
