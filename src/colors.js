'use strict'

const chalk = require('chalk')
const { stdout: { level } = {} } = require('supports-color')

const getColors = function({ opts }) {
  const chalkOpts = getChalkOpts({ opts })
  return chalk.constructor(chalkOpts)
}

// Can disable or force colors with `opts.colors`.
// chalk will automatically disable colors if output does not support it.
const getChalkOpts = function({ opts: { colors } }) {
  if (colors === false) {
    return { enabled: false }
  }

  // Chalk `level` must be set otherwise `enabled` will be noop if terminal
  // does not support color (e.g. during a shell file redirection)
  // However it should only be set if it is `undefined` or `0`
  return { enabled: true, level: level || 2 }
}

module.exports = {
  getColors,
}
