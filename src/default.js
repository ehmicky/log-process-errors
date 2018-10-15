'use strict'

const { exit } = require('process')

// Default event handler
const defaultHandler = function({ eventName, message }) {
  const level = eventName === 'warning' ? 'warn' : 'error'
  // eslint-disable-next-line no-restricted-globals, no-console
  console[level](message)

  // See https://nodejs.org/api/process.html#process_warning_using_uncaughtexception_correctly
  if (eventName === 'uncaughtException') {
    exit(1)
  }
}

module.exports = {
  defaultHandler,
}
