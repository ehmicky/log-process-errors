'use strict'

// Required directly because this is exposed through documentation, but not
// through code
// eslint-disable-next-line import/no-internal-modules
const { LEVELS, DEFAULT_LEVEL } = require('../../src/constants')

const { EVENTS } = require('./emit')
const { repeat } = require('./data_driven')

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

const repeatEvents = repeat.bind(null, getEvents())
const repeatLevels = repeat.bind(null, NORMAL_LEVELS)
const repeatEventsLevels = repeat.bind(null, getEvents(), NORMAL_LEVELS)

module.exports = {
  repeatEvents,
  repeatLevels,
  repeatEventsLevels,
}
