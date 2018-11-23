'use strict'

const {
  constants: { LEVELS },
} = require('../../dist')

const { EVENTS } = require('./emit')
const { repeat } = require('./data_driven')

const getEvents = function() {
  return Object.entries(EVENTS).map(getEvent)
}

const getEvent = function([eventName, emitEvent]) {
  const defaultLevel = eventName === 'warning' ? 'warn' : 'error'
  return { eventName, emitEvent, name: eventName, defaultLevel }
}

const repeatEvents = repeat.bind(null, getEvents())
const repeatLevels = repeat.bind(null, LEVELS)
const repeatEventsLevels = repeat.bind(null, getEvents(), LEVELS)

module.exports = {
  repeatEvents,
  repeatLevels,
  repeatEventsLevels,
}
