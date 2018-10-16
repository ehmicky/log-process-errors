'use strict'

const chalk = require('chalk')

const getColors = function({ opts: { colors } }) {
  // Can disable colors with `opts.colors: false`.
  // chalk will automatically disable colors if output does not support it.
  const enabled = Boolean(colors)

  return chalk.constructor({ enabled })
}

module.exports = {
  getColors,
}
