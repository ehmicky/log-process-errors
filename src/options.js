'use strict'

const { validate } = require('jest-validate')

const { defaultGetLevel } = require('./level')
const { defaultGetMessage } = require('./message')
const { defaultLog } = require('./log')
const { pickBy } = require('./utils')

// Validate options and assign default options
const getOptions = function({ opts }) {
  const optsA = pickBy(opts, value => value !== undefined)

  validate(optsA, { exampleConfig: DEFAULT_OPTS })

  const optsB = { ...DEFAULT_OPTS, ...optsA }
  return optsB
}

const DEFAULT_OPTS = {
  skipEvent: () => false,
  getLevel: defaultGetLevel,
  getMessage: defaultGetMessage,
  log: defaultLog,
  colors: true,
  exitOn: ['uncaughtException'],
}

module.exports = {
  getOptions,
}
