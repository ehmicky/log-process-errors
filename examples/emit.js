'use strict'

const { argv } = require('process')

const logProcessErrors = require('../custom')
const TYPES = require('../test')

// Emit one of the process events using its name (or a shortcut) as argument
// Used for development debugging
const emit = async function(typeName) {
  const fireFunc = getType(typeName)

  const stopLogging = logProcessErrors({ exitOn: [] })

  await fireFunc()

  stopLogging()
}

const getType = function(name) {
  // Use `startsWith()` to allow shortcuts
  const nameB = Object.keys(TYPES).find(nameA => nameA.startsWith(name))

  if (nameB !== undefined) {
    return TYPES[nameB]
  }

  const availableTypes = Object.keys(TYPES).join(', ')
  throw new Error(
    `Type ${name} does not exist. Available types: ${availableTypes}`,
  )
}

emit(argv[2])
