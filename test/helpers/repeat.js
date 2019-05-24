// Required directly because this is exposed through documentation, but not
// through code
import { DEFAULT_LEVEL } from '../../src/level.js'

import { EVENTS } from './emit/main.js'

const getEventData = function() {
  return Object.entries(EVENTS).map(getEvent)
}

const getEvent = function([eventName, emitEvent]) {
  const defaultLevel = DEFAULT_LEVEL[eventName]
  return { name: eventName, eventName, emitEvent, defaultLevel }
}

export const EVENT_DATA = getEventData()
