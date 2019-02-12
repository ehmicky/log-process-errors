'use strict'

const { emitWarning } = require('process')

const { circleFilled, info: infoSym, warning, cross } = require('figures')

const { result } = require('./utils')

// Retrieve error's `level`
const getLevel = function({ opts, info }) {
  const level = result(opts.level, info)

  if (LEVELS[level] !== undefined || level === 'silent') {
    return level
  }

  validateLevel({ level })

  return defaultLevel(info)
}

const validateLevel = function({ level }) {
  if (level === undefined) {
    return
  }

  const levels = Object.keys(LEVELS).join(', ')
  emitWarning(`Level ${level} is invalid. Must be one of: ${levels}`)
}

// Default `opts.level()`
const defaultLevel = function({ eventName }) {
  if (eventName === 'warning') {
    return 'warn'
  }

  return 'error'
}

// Each level is printed in a different way
const LEVELS = {
  debug: { COLOR: 'blue', SIGN: circleFilled },
  info: { COLOR: 'green', SIGN: infoSym },
  warn: { COLOR: 'yellow', SIGN: warning },
  error: { COLOR: 'red', SIGN: cross },
}

module.exports = {
  getLevel,
  defaultLevel,
  LEVELS,
}
