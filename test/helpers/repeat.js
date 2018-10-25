'use strict'

// eslint-disable-next-line import/no-internal-modules
const { LEVELS } = require('../../src/level')
const { EVENTS } = require('../../helpers')

const { repeat } = require('./data_driven')

const getEvents = function() {
  return Object.entries(EVENTS).map(([eventName, emitEvent]) => ({
    eventName,
    emitEvent,
    name: eventName,
  }))
}

const getLevels = function() {
  return Object.keys(LEVELS)
}

const repeatEvents = repeat.bind(null, getEvents())
const repeatLevels = repeat.bind(null, getLevels())
const repeatEventsLevels = repeat.bind(null, getEvents(), getLevels())

module.exports = {
  repeatEvents,
  repeatLevels,
  repeatEventsLevels,
}
