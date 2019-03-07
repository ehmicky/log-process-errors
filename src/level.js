'use strict'

const { emitWarning } = require('process')

const { multipleValidOptions } = require('jest-validate')

const { result, mapValues, pickBy } = require('./utils')
const { DEFAULT_LEVEL, LEVELS } = require('./constants')

// Retrieve event's log level
const getLevel = function({ opts, event, event: { name } }) {
  const level = result(opts.level[name], event)

  if (level === 'default') {
    return DEFAULT_LEVEL[name]
  }

  if (LEVELS.includes(level)) {
    return level
  }

  emitWarning(
    `Invalid option 'level.${name}' returning '${level}': function must return one of ${LEVELS.join(
      ', ',
    )}`,
  )

  return DEFAULT_LEVEL[name]
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
  return { ...defaultLevels, ...levelA }
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
