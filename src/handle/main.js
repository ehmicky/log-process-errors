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

export const EVENTS = {
  uncaughtException,
  warning,
  unhandledRejection,
  rejectionHandled,
}
