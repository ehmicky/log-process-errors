import { emitWarning } from 'node:process'
import { promisify } from 'node:util'

import { getError } from './error.test.js'

// TODO: replace with `timers/promises` `setImmediate()` after dropping support
// for Node <15.0.0
const pSetImmediate = promisify(setImmediate)

export const emitMany = async function (eventName, length) {
  await emitManyValues(getError, eventName, length)
}

export const emitManyValues = async function (getValue, eventName, length) {
  await Promise.all(
    Array.from({ length }, () => emitValue(getValue(), eventName)),
  )
}

export const emit = async function (eventName) {
  await emitValue(getError(), eventName)
}

export const emitValue = async function (value, eventName) {
  await EVENTS_MAP[eventName](value)
  await pSetImmediate()
}

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

// `rejectionHandled` also fires an additional event: the initial
// `unhandledRejection`
export const getCallCount = function (eventName) {
  return eventName === 'rejectionHandled' ? 2 : 1
}
