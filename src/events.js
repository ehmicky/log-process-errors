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

// eslint-disable-next-line max-params
const multipleResolves = function(context, type, promise, secondPromiseValue) {
  const secondPromiseState = TYPE_TO_STATE[type]
  handleEvent({ ...context, promise, secondPromiseState, secondPromiseValue })
}

const TYPE_TO_STATE = {
  resolve: 'resolved',
  reject: 'rejected',
}

module.exports = {
  uncaughtException,
  warning,
  unhandledRejection,
  rejectionHandled,
  multipleResolves,
}
