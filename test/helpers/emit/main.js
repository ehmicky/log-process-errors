'use strict'

const { uncaughtException } = require('./uncaught_exception')
const { unhandledRejection } = require('./unhandled_rejection')
const { rejectionHandled } = require('./rejection_handled')
const { multipleResolves } = require('./multiple_resolves')
const { warning } = require('./warning')
const { all } = require('./all')

const EVENTS = {
  uncaughtException,
  unhandledRejection,
  rejectionHandled,
  multipleResolves,
  warning,
}

const ALL_EVENTS = { ...EVENTS, all }

module.exports = {
  EVENTS,
  ALL_EVENTS,
}
