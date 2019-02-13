'use strict'

const { emitWarning } = require('process')

const { multipleValidOptions } = require('jest-validate')

const { result, mapValues, pickBy } = require('./utils')
const { DEFAULT_LEVEL, ALL_LEVELS } = require('./constants')

// Retrieve event's log level
const getLevel = function({ opts, info, info: { eventName } }) {
  const level = result(opts.level[eventName], info)

  if (ALL_LEVELS.includes(level)) {
    return level
  }

  validateLevel({ level })

  return DEFAULT_LEVEL[eventName]
}

const validateLevel = function({ level }) {
  if (level === undefined) {
    return
  }

  const levels = Object.keys(ALL_LEVELS).join(', ')
  emitWarning(`Level '${level}' is invalid. Must be one of: ${levels}`)
}

// Apply `opts.level.default` and default values to `opts.level`
const applyDefaultLevels = function({
  opts: { level: { default: defaultLevel, ...level } = {} },
}) {
  const levelA = pickBy(level, value => value !== undefined)

  if (defaultLevel === undefined) {
    return { ...DEFAULT_LEVEL, ...levelA }
  }

  const defaultLevels = mapValues(DEFAULT_LEVEL, () => defaultLevel)
  return { ...DEFAULT_LEVEL, ...defaultLevels, ...levelA }
}

// Use during options validation
const getExampleLevels = function() {
  return mapValues(DEFAULT_LEVEL, getExampleLevel)
}

const getExampleLevel = function(level) {
  // eslint-disable-next-line no-empty-function
  return multipleValidOptions(level, () => {})
}

module.exports = {
  getLevel,
  applyDefaultLevels,
  getExampleLevels,
}
