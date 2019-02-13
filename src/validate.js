'use strict'

const { EVENTS, ALL_LEVELS } = require('./constants')

// Validation beyond what `jest-validate` can do
const validateOptions = function({ exitOn, level = {} }) {
  validateLevels({ level })
  validateExitOn({ exitOn })
}

const validateLevels = function({ level }) {
  Object.entries(level).forEach(validateLevel)
}

const validateLevel = function([eventName, level]) {
  if (ALLOWED_LEVELS.includes(level) || typeof level === 'function') {
    return
  }

  const allowedLevels = ALLOWED_LEVELS.map(String).join(', ')
  throw new Error(
    `Invalid option 'level.${eventName}' '${level}': must be one of ${allowedLevels}`,
  )
}

const ALLOWED_LEVELS = [...ALL_LEVELS, undefined]

const validateExitOn = function({ exitOn }) {
  if (exitOn === undefined) {
    return
  }

  const invalidEvents = exitOn.filter(eventName => !EVENTS.includes(eventName))

  if (invalidEvents.length === 0) {
    return
  }

  throw new Error(
    `Invalid option 'exitOn' '${invalidEvents.join(
      ', ',
    )}': must be one of ${EVENTS.join(', ')}`,
  )
}

module.exports = {
  validateOptions,
}
