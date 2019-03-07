'use strict'

const process = require('process')

const { EVENTS } = require('./emit')

// Ava sets up process `uncaughtException` and `unhandledRejection` handlers
// which makes testing them harder.
const removeProcessListeners = function() {
  Object.keys(EVENTS).forEach(name => {
    // We keep the default `warning` event listener so we can test it
    if (name === 'warning') {
      return
    }

    process.removeAllListeners(name)
  })
}

removeProcessListeners()

module.exports = {}
