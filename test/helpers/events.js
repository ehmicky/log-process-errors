import { emitWarning } from 'process'
import { promisify } from 'util'

import mapObj from 'map-obj'

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

const EVENTS_SIMPLE_MAP = {
  uncaughtException,
  unhandledRejection,
  rejectionHandled,
  warning,
}

const getEventsMap = function () {
  return mapObj(EVENTS_SIMPLE_MAP, getEvent)
}

const getEvent = function (eventName, emit) {
  const emitMany = emitEvents.bind(undefined, emit)
  return [eventName, { title: eventName, eventName, emit, emitMany }]
}

// Emit several emits in parallel
const emitEvents = async function (emit, length) {
  await Promise.all(Array.from({ length }, emit))
}

// Map of all possible events, with related information and helper methods
export const EVENTS_MAP = getEventsMap()

// Same as an array
export const EVENTS = Object.values(EVENTS_MAP)
