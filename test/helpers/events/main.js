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

const getEvents = function() {
  return mapValues(EVENTS_MAP, getEvent)
}

const EVENTS_MAP = {
  uncaughtException,
  unhandledRejection,
  rejectionHandled,
  ...(hasMultipleResolves() ? { multipleResolves } : {}),
  warning,
}

const getEvent = function(emitEvent, eventName) {
  const defaultLevel = DEFAULT_LEVEL[eventName]
  return { name: eventName, eventName, emitEvent, defaultLevel }
}

export const EVENTS = getEvents()

export const EVENT_DATA = Object.values(EVENTS)
