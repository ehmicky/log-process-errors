// Required directly because this is exposed through documentation, but not
// through code
import { LEVELS, DEFAULT_LEVEL } from '../../src/level.js'

import { RUNNERS } from './runners.js'
import { EVENTS } from './emit/main.js'
import { repeat } from './data_driven/main.js'

const getEventData = function() {
  return Object.entries(EVENTS).map(getEvent)
}

const getEvent = function([eventName, emitEvent]) {
  const defaultLevel = DEFAULT_LEVEL[eventName]
  return { name: eventName, eventName, emitEvent, defaultLevel }
}

const EVENT_DATA = getEventData()

const isNormalLevel = function(level) {
  return level !== 'silent' && level !== 'default'
}

const NORMAL_LEVELS = LEVELS.filter(isNormalLevel)

export const repeatEvents = repeat.bind(null, EVENT_DATA)
export const repeatEventsLevels = repeat.bind(null, EVENT_DATA, NORMAL_LEVELS)
export const repeatEventsRunners = repeat.bind(null, RUNNERS, EVENT_DATA)
