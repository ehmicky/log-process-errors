'use strict'

const { fireUncaughtException } = require('./uncaught_exception')
const { fireUnhandledRejection } = require('./unhandled_rejection')
const { fireRejectionHandled } = require('./rejection_handled')
const { fireMultipleResolves } = require('./multiple_resolves')
const { fireWarning } = require('./warning')

const fireAll = async function() {
  await fireUncaughtException()
  await fireUnhandledRejection()
  await fireRejectionHandled()
  await fireMultipleResolves()
  await fireWarning()
}

module.exports = {
  fireAll,
}
