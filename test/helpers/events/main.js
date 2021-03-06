import mapObj from 'map-obj'

import { multipleResolves } from './multiple_resolves.js'
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
  multipleResolves,
  warning,
}

const getEvent = function (eventName, emit) {
  const emitMany = emitEvents.bind(undefined, emit)
  const defaultLevel = DEFAULT_LEVEL[eventName]
  return [
    eventName,
    { title: eventName, eventName, emit, emitMany, defaultLevel },
  ]
}

// Emit several emits in parallel
export const emitEvents = async function (emit, maxEvents) {
  const array = Array.from({ length: maxEvents }, emit)
  await Promise.all(array)
}

const DEFAULT_LEVEL = {
  default: 'error',
  uncaughtException: 'error',
  warning: 'warn',
  unhandledRejection: 'error',
  rejectionHandled: 'error',
  multipleResolves: 'info',
}

// Map of all possible events, with related information and helper methods
export const EVENTS_MAP = getEventsMap()

// Same as an array
export const EVENTS = Object.values(EVENTS_MAP)
