import { emitWarning } from 'process'
import { promisify } from 'util'

// TODO: replace with `timers/promises` `setImmediate()` after dropping support
// for Node <15.0.0
const pSetImmediate = promisify(setImmediate)

const uncaughtException = async function () {
  setImmediate(() => {
    throw new Error('message')
  })
  await pSetImmediate()
}

const unhandledRejection = async function () {
  // eslint-disable-next-line promise/catch-or-return
  Promise.reject(new Error('message'))
  await pSetImmediate()
}

const rejectionHandled = async function () {
  const promise = Promise.reject(new Error('message'))
  await pSetImmediate()
  // eslint-disable-next-line promise/prefer-await-to-then
  promise.catch(() => {})
  await pSetImmediate()
}

const warning = async function () {
  emitWarning('message')
  await pSetImmediate()
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
  await EVENTS_MAP[eventName]()
}
