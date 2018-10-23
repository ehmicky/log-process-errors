'use strict'

const { argv } = require('process')

const logProcessErrors = require('../custom')
const EVENTS = require('../helpers')

// Emit one of the process events using its name (or a shortcut) as argument
// Used for development debugging
const emit = async function(typeName) {
  const emitEvent = getEmitEvent(typeName)

  const stopLogging = logProcessErrors({ exitOn: [] })

  await emitEvent()

  stopLogging()
}

const getEmitEvent = function(name) {
  // Use `startsWith()` to allow shortcuts
  const nameB = Object.keys(EVENTS).find(nameA => nameA.startsWith(name))

  if (nameB !== undefined) {
    return EVENTS[nameB]
  }

  const availableEvents = Object.keys(EVENTS).join(', ')
  throw new Error(
    `Event ${name} does not exist. Available events: ${availableEvents}`,
  )
}

emit(argv[2])
