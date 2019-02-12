'use strict'

const { emitWarning } = require('process')

const { circleFilled, info: infoSym, warning, cross } = require('figures')

// Retrieve error's `level`
const getLevel = function({ opts, info }) {
  const level = opts.level(info)

  if (LEVELS[level] !== undefined) {
    return level
  }

  const levels = Object.keys(LEVELS).join(', ')
  emitWarning(`Level ${level} is invalid. Must be one of: ${levels}`)

  return defaultLevel(info)
}

// Each level is printed in a different way
const LEVELS = {
  debug: { COLOR: 'blue', SIGN: circleFilled },
  info: { COLOR: 'green', SIGN: infoSym },
  warn: { COLOR: 'yellow', SIGN: warning },
  error: { COLOR: 'red', SIGN: cross },
}

// Default `opts.level()`
const defaultLevel = function({ eventName }) {
  if (eventName === 'warning') {
    return 'warn'
  }

  return 'error'
}

module.exports = {
  getLevel,
  defaultLevel,
  LEVELS,
}
