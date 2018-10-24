// eslint-disable-next-line ava/no-ignored-test-files
'use strict'

const test = require('ava')

// eslint-disable-next-line import/no-internal-modules
const { LEVELS } = require('../../src/level')
const EVENTS = require('../../helpers')

// Create one test for each process event
const forEachEvent = function(func) {
  getEvents().forEach(({ eventName, emitEvent }) => {
    const testA = prefixTitle(`[${eventName}]`)
    func({ eventName, emitEvent, test: testA })
  })
}

// Create one test for each process event + level combination
const forEachEventLevel = function(func) {
  getEventsLevels().forEach(({ eventName, emitEvent, level }) => {
    const testA = prefixTitle(`[${eventName}] [${level}]`)
    func({ eventName, emitEvent, level, test: testA })
  })
}

const getEventsLevels = function() {
  return getEvents().flatMap(getEventLevels)
}

const getEvents = function() {
  return Object.entries(EVENTS)
    .filter(([eventName]) => eventName !== 'all')
    .map(([eventName, emitEvent]) => ({ eventName, emitEvent }))
}

const getEventLevels = function({ eventName, emitEvent }) {
  return Object.keys(LEVELS).map(level => ({ eventName, emitEvent, level }))
}

// Prefix test title
const prefixTitle = function(prefix) {
  return (title, ...args) => test(`${prefix} ${title}`, ...args)
}

module.exports = {
  forEachEvent,
  forEachEventLevel,
}
