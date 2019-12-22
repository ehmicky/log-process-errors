// Required directly because this is exposed through documentation, but not
// through code
import { DEFAULT_LEVEL } from '../../../src/level.js'
import { mapValues } from '../../../src/utils.js'

import { uncaughtException } from './uncaught_exception.js'
import { unhandledRejection } from './unhandled_rejection.js'
import { rejectionHandled } from './rejection_handled.js'
import { multipleResolves } from './multiple_resolves.js'
import { warning } from './warning.js'

const getEventsMap = function() {
  return mapValues(EVENTS_SIMPLE_MAP, getEvent)
}

const EVENTS_SIMPLE_MAP = {
  uncaughtException,
  unhandledRejection,
  rejectionHandled,
  multipleResolves,
  warning,
}

const getEvent = function(emit, eventName) {
  const emitMany = emitEvents.bind(null, emit)
  const defaultLevel = DEFAULT_LEVEL[eventName]
  return { title: eventName, eventName, emit, emitMany, defaultLevel }
}

// Emit several emits in parallel
export const emitEvents = async function(emit, maxEvents) {
  const array = Array.from({ length: maxEvents }, emit)
  await Promise.all(array)
}

// Map of all possible events, with related information and helper methods
export const EVENTS_MAP = getEventsMap()

// Same as an array
export const EVENTS = Object.values(EVENTS_MAP)
