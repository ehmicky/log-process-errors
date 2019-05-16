// Required directly because this is exposed through documentation, but not
// through code
import { LEVELS, DEFAULT_LEVEL } from '../../src/level.js'

import { RUNNERS } from './runners.js'
import { EVENTS } from './emit/main.js'
import { repeat } from './data_driven/main.js'

const getEvents = function() {
  return Object.entries(EVENTS).map(getEvent)
}

const getEvent = function([name, emitEvent]) {
  const defaultLevel = DEFAULT_LEVEL[name]
  return { emitEvent, name, defaultLevel }
}

const isNormalLevel = function(level) {
  return level !== 'silent' && level !== 'default'
}

const NORMAL_LEVELS = LEVELS.filter(isNormalLevel)

export const repeatEvents = func => repeat(func, getEvents())
export const repeatLevels = func => repeat(func, NORMAL_LEVELS)
export const repeatEventsLevels = func =>
  repeat(func, getEvents(), NORMAL_LEVELS)
export const repeatEventsRunners = func => repeat(func, RUNNERS, getEvents())
