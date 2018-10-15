'use strict'

// Default `opts.handlerFunc`
const defaultHandler = function({ eventName, message }) {
  const level = eventName === 'warning' ? 'warn' : 'error'
  // eslint-disable-next-line no-restricted-globals, no-console
  console[level](message)
}

const DEFAULT_OPTS = {
  handlerFunc: defaultHandler,
  exitOnExceptions: true,
}

module.exports = {
  DEFAULT_OPTS,
}
