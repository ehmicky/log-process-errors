'use strict'

const { argv } = require('process')

const { init } = require('../../../build')

const { ALL_EVENTS } = require('./main')

// Emit one of the process events using its name (or a shortcut) as argument
// Used for development debugging
const fireEvent = async function(typeName) {
  const emitEvent = getEmitEvent(typeName)

  const stopLogging = init({ exitOn: [] })

  await emitEvent()

  stopLogging()
}

const getEmitEvent = function(name) {
  // Use `startsWith()` to allow shortcuts
  const nameB = Object.keys(ALL_EVENTS).find(nameA => nameA.startsWith(name))

  if (nameB !== undefined) {
    return ALL_EVENTS[nameB]
  }

  const availableEvents = Object.keys(ALL_EVENTS).join(', ')
  throw new Error(
    `Event ${name} does not exist. Available events: ${availableEvents}`,
  )
}

fireEvent(argv[2])
