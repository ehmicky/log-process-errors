import { handleEvent } from './common.js'

// List of all handled events
// Each event must pass its related `value` to the generic `handleEvent()`
const uncaughtException = function (context, value) {
  handleEvent({ ...context, value })
}

const warning = function (context, value) {
  handleEvent({ ...context, value })
}

const unhandledRejection = function (context, value, promise) {
  handleEvent({ ...context, promise, value })
}

const rejectionHandled = function (context, promise) {
  handleEvent({ ...context, promise })
}

// eslint-disable-next-line max-params
const multipleResolves = function (context, type, promise, nextValue) {
  const nextRejected = TYPE_TO_REJECTED[type]
  handleEvent({ ...context, promise, nextRejected, nextValue })
}

const TYPE_TO_REJECTED = {
  resolve: false,
  reject: true,
}

export const EVENTS = {
  uncaughtException,
  warning,
  unhandledRejection,
  rejectionHandled,
  multipleResolves,
}
