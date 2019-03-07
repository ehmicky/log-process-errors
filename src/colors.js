'use strict'

const chalk = require('chalk')

const getChalk = function(enabled) {
  // Can disable colors with `opts.colors`.
  // chalk will automatically disable colors if output does not support it.
  return new chalk.constructor({ enabled })
}

module.exports = {
  getChalk,
}
