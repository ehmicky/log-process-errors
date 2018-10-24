'use strict'

const chalk = require('chalk')

const getColors = function({ opts: { colors } }) {
  // Can disable or force colors with `opts.colors`.
  // chalk will automatically disable colors if output does not support it.
  const chalkOpts = { enabled: Boolean(colors) }

  return chalk.constructor(chalkOpts)
}

module.exports = {
  getColors,
}
