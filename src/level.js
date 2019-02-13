'use strict'

const { emitWarning } = require('process')

const { circleFilled, info: infoSym, warning, cross } = require('figures')
const { multipleValidOptions } = require('jest-validate')

const { result, mapValues } = require('./utils')
const { DEFAULT_LEVEL } = require('./constants')

// Retrieve error's `level`
const getLevel = function({ opts, info, info: { eventName } }) {
  const level = result(opts.level[eventName], info)

  if (LEVELS[level] !== undefined || level === 'silent') {
    return level
  }

  validateLevel({ level })

  return DEFAULT_LEVEL[eventName]
}

const validateLevel = function({ level }) {
  if (level === undefined) {
    return
  }

  const levels = Object.keys(LEVELS).join(', ')
  emitWarning(`Level '${level}' is invalid. Must be one of: ${levels}`)
}

// Apply `opts.level.default` and default values to `opts.level`
const applyDefaultLevels = function({
  opts: { level: { default: defaultLevel, ...level } = {} },
}) {
  if (defaultLevel === undefined) {
    return { ...DEFAULT_LEVEL, ...level }
  }

  const defaultLevels = mapValues(DEFAULT_LEVEL, () => defaultLevel)
  return { ...DEFAULT_LEVEL, ...defaultLevels, ...level }
}

// Use during options validation
const getExampleLevels = function() {
  return mapValues(DEFAULT_LEVEL, getExampleLevel)
}

const getExampleLevel = function(level) {
  // eslint-disable-next-line no-empty-function
  return multipleValidOptions(level, () => {})
}

// Each level is printed in a different way
const LEVELS = {
  debug: { COLOR: 'blue', SIGN: circleFilled },
  info: { COLOR: 'green', SIGN: infoSym },
  warn: { COLOR: 'yellow', SIGN: warning },
  error: { COLOR: 'red', SIGN: cross },
}

module.exports = {
  getLevel,
  applyDefaultLevels,
  getExampleLevels,
  LEVELS,
}
