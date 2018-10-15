'use strict'

// Default event handler
const defaultHandler = function({ eventName, message }) {
  const level = eventName === 'warning' ? 'warn' : 'error'
  // eslint-disable-next-line no-restricted-globals, no-console
  console[level](message)
}

module.exports = {
  defaultHandler,
}
