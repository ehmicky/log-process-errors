import { handleEvent } from './common.js'

// List of all handled events
// Each event must pass its related `value` to the generic `handleEvent()`
export const uncaughtException = function (context, value) {
  handleEvent({ ...context, value })
}

export const warning = function (context, value) {
  handleEvent({ ...context, value })
}

export const unhandledRejection = function (context, value, promise) {
  handleEvent({ ...context, promise, value })
}

export const rejectionHandled = function (context, promise) {
  handleEvent({ ...context, promise })
}

// eslint-disable-next-line max-params
export const multipleResolves = function (context, type, promise, nextValue) {
  const nextRejected = TYPE_TO_REJECTED[type]
  handleEvent({ ...context, promise, nextRejected, nextValue })
}

const TYPE_TO_REJECTED = {
  resolve: false,
  reject: true,
}
