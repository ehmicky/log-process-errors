'use strict'

const { uncaughtException } = require('./uncaught_exception')
const { unhandledRejection } = require('./unhandled_rejection')
const { rejectionHandled } = require('./rejection_handled')
const { multipleResolves } = require('./multiple_resolves')
const { warning } = require('./warning')

const EVENTS = {
  uncaughtException,
  unhandledRejection,
  rejectionHandled,
  multipleResolves,
  warning,
}

// Emit all process error events
const all = async function() {
  // eslint-disable-next-line fp/no-loops
  for (const emitEvent of Object.values(EVENTS)) {
    // eslint-disable-next-line no-await-in-loop
    await emitEvent()
  }
}

const ALL_EVENTS = { ...EVENTS, all }

module.exports = {
  all,
  EVENTS,
  ALL_EVENTS,
}
