'use strict'

const { handleEvent } = require('./handle')

// List of all handled events
// Each event must pass its related `error` or `promise` to the generic
// `handleEvent()`
const uncaughtException = function(context, error) {
  handleEvent({ ...context, error })
}

const warning = function(context, error) {
  handleEvent({ ...context, error })
}

const unhandledRejection = function(context, promiseValue, promise) {
  handleEvent({ ...context, promise, promiseValue })
}

const rejectionHandled = function(context, promise) {
  handleEvent({ ...context, promise })
}

// eslint-disable-next-line no-inline-comments
const multipleResolves = function(context, type, promise /*, promiseValue */) {
  handleEvent({ ...context, promise })
}

module.exports = {
  uncaughtException,
  warning,
  unhandledRejection,
  rejectionHandled,
  multipleResolves,
}
