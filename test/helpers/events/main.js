import mapObj from 'map-obj'

import { rejectionHandled } from './rejection_handled.js'
import { uncaughtException } from './uncaught_exception.js'
import { unhandledRejection } from './unhandled_rejection.js'
import { warning } from './warning.js'

const getEventsMap = function () {
  return mapObj(EVENTS_SIMPLE_MAP, getEvent)
}

const EVENTS_SIMPLE_MAP = {
  uncaughtException,
  unhandledRejection,
  rejectionHandled,
  warning,
}

const getEvent = function (eventName, emit) {
  const emitMany = emitEvents.bind(undefined, emit)
  return [eventName, { title: eventName, eventName, emit, emitMany }]
}

// Emit several emits in parallel
export const emitEvents = async function (emit, maxEvents) {
  const array = Array.from({ length: maxEvents }, emit)
  await Promise.all(array)
}

// Map of all possible events, with related information and helper methods
export const EVENTS_MAP = getEventsMap()

// Same as an array
export const EVENTS = Object.values(EVENTS_MAP)
