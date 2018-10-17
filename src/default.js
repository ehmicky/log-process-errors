'use strict'

const { defaultGetLevel } = require('./level')
const { defaultGetMessage } = require('./message')
const { defaultLog } = require('./log')

const DEFAULT_OPTS = {
  skipEvent: () => false,
  getLevel: defaultGetLevel,
  getMessage: defaultGetMessage,
  log: defaultLog,
  colors: true,
  exitOn: ['uncaughtException'],
}

module.exports = {
  DEFAULT_OPTS,
}
