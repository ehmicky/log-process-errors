'use strict'

const { validate } = require('jest-validate')

const { applyDefaultLevels, getExampleLevels } = require('./level')
const { defaultMessage } = require('./message')
const { defaultLog } = require('./log')
const { pickBy } = require('./utils')

// Validate options and assign default options
const getOptions = function({ opts = {} }) {
  const optsA = pickBy(opts, value => value !== undefined)

  validate(optsA, { exampleConfig: EXAMPLE_OPTS })

  const level = applyDefaultLevels({ opts: optsA })
  const optsB = { ...DEFAULT_OPTS, ...optsA, level }
  return optsB
}

const DEFAULT_OPTS = {
  message: defaultMessage,
  log: defaultLog,
  colors: true,
  exitOn: ['uncaughtException'],
}

const EXAMPLE_OPTS = {
  ...DEFAULT_OPTS,
  level: getExampleLevels(),
}

module.exports = {
  getOptions,
}
