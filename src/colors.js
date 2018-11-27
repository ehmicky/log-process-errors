'use strict'

const chalk = require('chalk')

const getColors = function({ opts: { colors } }) {
  // Can disable colors with `opts.colors`.
  // chalk will automatically disable colors if output does not support it.
  return new chalk.constructor({ enabled: colors })
}

module.exports = {
  getColors,
}
