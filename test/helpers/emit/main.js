'use strict'

const { uncaughtException } = require('./uncaught_exception')
const { unhandledRejection } = require('./unhandled_rejection')
const { rejectionHandled } = require('./rejection_handled')
const { multipleResolves } = require('./multiple_resolves')
const { warning } = require('./warning')
const { hasMultipleResolves } = require('./version')

const EVENTS = {
  uncaughtException,
  unhandledRejection,
  rejectionHandled,
  ...(hasMultipleResolves() ? { multipleResolves } : {}),
  warning,
}

module.exports = {
  EVENTS,
}
