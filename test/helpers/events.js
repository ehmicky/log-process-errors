import { emitWarning } from 'process'
import { promisify } from 'util'

// TODO: replace with `timers/promises` `setImmediate()` after dropping support
// for Node <15.0.0
const pSetImmediate = promisify(setImmediate)

const uncaughtException = function (value) {
  setImmediate(() => {
    throw value
  })
}

const unhandledRejection = function (value) {
  // eslint-disable-next-line promise/catch-or-return
  Promise.reject(value)
}

const rejectionHandled = async function (value) {
  const promise = Promise.reject(value)
  await pSetImmediate()
  // eslint-disable-next-line promise/prefer-await-to-then
  promise.catch(() => {})
}

const warning = function (value) {
  emitWarning(value)
}

const EVENTS_MAP = {
  uncaughtException,
  unhandledRejection,
  rejectionHandled,
  warning,
}

export const EVENTS = Object.keys(EVENTS_MAP)

export const emitMany = async function (eventName, length) {
  await Promise.all(Array.from({ length }, emit.bind(undefined, eventName)))
}

export const emit = async function (eventName) {
  const error = new Error('message')
  await EVENTS_MAP[eventName](error)
  await pSetImmediate()
}
