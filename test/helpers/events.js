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

export const emitManyValues = async function (getValue, eventName, length) {
  await Promise.all(
    Array.from({ length }, (_, index) =>
      emitValue(getValue.bind(undefined, index), eventName),
    ),
  )
}

const emitValue = async function (getValue, eventName) {
  await EVENTS_MAP[eventName](getValue())
  await pSetImmediate()
}

const getError = function () {
  return new Error('message')
}

export const emit = emitValue.bind(undefined, getError)
export const emitMany = emitManyValues.bind(undefined, getError)
