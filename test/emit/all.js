'use strict'

const { uncaughtException } = require('./uncaught_exception')
const { unhandledRejection } = require('./unhandled_rejection')
const { rejectionHandled } = require('./rejection_handled')
const { multipleResolves } = require('./multiple_resolves')
const { warning } = require('./warning')

// Emit all process error events
const all = async function() {
  await uncaughtException()
  await unhandledRejection()
  await rejectionHandled()
  await multipleResolves()
  await warning()
}

module.exports = {
  all,
}
