'use strict'

const { validate, multipleValidOptions } = require('jest-validate')

const { defaultLevel } = require('./level')
const { defaultMessage } = require('./message')
const { defaultLog } = require('./log')
const { pickBy } = require('./utils')

// Validate options and assign default options
const getOptions = function({ opts = {} }) {
  const optsA = pickBy(opts, value => value !== undefined)

  validate(optsA, { exampleConfig: EXAMPLE_OPTS })

  const optsB = { ...DEFAULT_OPTS, ...optsA }
  return optsB
}

const DEFAULT_OPTS = {
  level: defaultLevel,
  message: defaultMessage,
  log: defaultLog,
  colors: true,
  exitOn: ['uncaughtException'],
}

const EXAMPLE_OPTS = {
  ...DEFAULT_OPTS,
  level: multipleValidOptions(defaultLevel, 'warn'),
}

module.exports = {
  getOptions,
}
