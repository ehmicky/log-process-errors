'use strict'

const { defaultGetLevel } = require('./level')
const { defaultGetMessage } = require('./message')

// Default `opts.handlerFunc`
const defaultHandler = function(message, level) {
  // eslint-disable-next-line no-restricted-globals, no-console
  console[level](message)
}

const DEFAULT_OPTS = {
  getLevel: defaultGetLevel,
  getMessage: defaultGetMessage,
  handlerFunc: defaultHandler,
  exitOnExceptions: true,
}

module.exports = {
  DEFAULT_OPTS,
}
