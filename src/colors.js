'use strict'

const Chalk = require('chalk')
const moize = require('moize').default

// Can disable colors with `opts.colors`.
// chalk will automatically disable colors if output does not support it.
const getChalk = function(enabled) {
  const chalk = new Chalk.constructor({ enabled })
  return { chalk }
}

const mGetChalk = moize(getChalk)

module.exports = {
  getChalk: mGetChalk,
}
