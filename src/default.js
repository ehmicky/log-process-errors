'use strict'

const { defaultGetLevel } = require('./level')
const { defaultGetMessage } = require('./message')
const { defaultLog } = require('./log')

const DEFAULT_OPTS = {
  getLevel: defaultGetLevel,
  getMessage: defaultGetMessage,
  log: defaultLog,
  exitOnExceptions: true,
}

module.exports = {
  DEFAULT_OPTS,
}
