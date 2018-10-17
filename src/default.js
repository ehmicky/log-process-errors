'use strict'

const { validate } = require('jest-validate')

const { defaultGetLevel } = require('./level')
const { defaultGetMessage } = require('./message')
const { defaultLog } = require('./log')

// Validate options and assign default options
const getOpts = function({ opts }) {
  validate(opts, { exampleConfig: DEFAULT_OPTS })

  const optsA = { ...DEFAULT_OPTS, ...opts }
  return optsA
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
  getOpts,
}
