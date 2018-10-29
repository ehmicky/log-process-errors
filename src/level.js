'use strict'

const {
  platform,
  env: { TERM },
  emitWarning,
} = require('process')

// Retrieve error's `level`
const getLevel = function({ opts, info }) {
  const level = opts.getLevel(info)

  if (LEVELS[level] !== undefined) {
    return level
  }

  const levels = Object.keys(LEVELS).join(', ')
  emitWarning(`Level ${level} is invalid. Must be one of: ${levels}`)

  return defaultGetLevel(info)
}

// TODO: remove `istanbul` comment once Windows is tested
// istanbul ignore next
const supportsUnicode = platform !== 'win32' || TERM === 'xterm-256color'
// Each level is printed in a different way
// istanbul ignore next
const LEVELS = {
  debug: {
    COLOR: 'blue',
    SIGN: supportsUnicode ? '\u2699' : '!',
  },
  info: {
    COLOR: 'green',
    SIGN: supportsUnicode ? '\u2139' : 'i',
  },
  warn: {
    COLOR: 'yellow',
    SIGN: supportsUnicode ? '\u26A0' : '\u203C',
  },
  error: {
    COLOR: 'red',
    SIGN: supportsUnicode ? '\u2718' : '\u00D7',
  },
}

// Default `opts.getLevel()`
const defaultGetLevel = function({ eventName }) {
  if (eventName === 'warning') {
    return 'warn'
  }

  return 'error'
}

module.exports = {
  getLevel,
  defaultGetLevel,
  LEVELS,
}
