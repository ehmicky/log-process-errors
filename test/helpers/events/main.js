// Required directly because this is exposed through documentation, but not
// through code
import { DEFAULT_LEVEL } from '../../../src/level.js'
import { mapValues } from '../../../src/utils.js'

import { uncaughtException } from './uncaught_exception.js'
import { unhandledRejection } from './unhandled_rejection.js'
import { rejectionHandled } from './rejection_handled.js'
import { multipleResolves } from './multiple_resolves.js'
import { warning } from './warning.js'
import { hasMultipleResolves } from './version.js'

const getEventsMap = function() {
  return mapValues(EVENTS_SIMPLE_MAP, getEvent)
}

const EVENTS_SIMPLE_MAP = {
  uncaughtException,
  unhandledRejection,
  rejectionHandled,
  ...(hasMultipleResolves() ? { multipleResolves } : {}),
  warning,
}

const getEvent = function(emitEvent, eventName) {
  const emitMany = emitEvents.bind(null, emitEvent)
  const defaultLevel = DEFAULT_LEVEL[eventName]
  return { name: eventName, eventName, emitEvent, emitMany, defaultLevel }
}

// Emit several emits in parallel
export const emitEvents = async function(emitEvent, maxEvents) {
  const array = Array.from({ length: maxEvents }, emitEvent)
  await Promise.all(array)
}

export const EVENTS_MAP = getEventsMap()

export const EVENTS = Object.values(EVENTS_MAP)
