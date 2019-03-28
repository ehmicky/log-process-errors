'use strict'

// Required directly because this is exposed through documentation, but not
// through code
const { LEVELS, DEFAULT_LEVEL } = require('../../src/constants')
const { RUNNERS } = require('../../src/options/runners')

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

const getRunners = function() {
  return Object.entries(RUNNERS).map(getRunner)
}

const getRunner = function([testing, testOpts]) {
  return { ...testOpts, testing, name: testing }
}

const repeatEvents = repeat.bind(null, getEvents())
const repeatLevels = repeat.bind(null, NORMAL_LEVELS)
const repeatEventsLevels = repeat.bind(null, getEvents(), NORMAL_LEVELS)
const repeatEventsRunners = repeat.bind(null, getRunners(), getEvents())

module.exports = {
  repeatEvents,
  repeatLevels,
  repeatEventsLevels,
  repeatEventsRunners,
}
