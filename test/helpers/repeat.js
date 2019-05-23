// Required directly because this is exposed through documentation, but not
// through code
import { LEVELS, DEFAULT_LEVEL } from '../../src/level.js'

import { RUNNERS } from './runners.js'
import { EVENTS } from './emit/main.js'
import { repeat } from './data_driven/main.js'

const getEvents = function() {
  return Object.entries(EVENTS).map(getEvent)
}

const getEvent = function([eventName, emitEvent]) {
  const defaultLevel = DEFAULT_LEVEL[eventName]
  return { emitEvent, eventName, defaultLevel }
}

const isNormalLevel = function(level) {
  return level !== 'silent' && level !== 'default'
}

const NORMAL_LEVELS = LEVELS.filter(isNormalLevel)

export const repeatEvents = repeat.bind(null, getEvents())
export const repeatLevels = repeat.bind(null, NORMAL_LEVELS)
export const repeatEventsLevels = repeat.bind(null, getEvents(), NORMAL_LEVELS)
export const repeatEventsRunners = repeat.bind(null, RUNNERS, getEvents())
