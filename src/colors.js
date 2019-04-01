'use strict'

const Chalk = require('chalk')

// Can disable colors with `opts.colors`.
// chalk will automatically disable colors if output does not support it.
const addChalk = function(opts) {
  const chalk = getChalk(opts)
  return { ...opts, chalk }
}

const getChalk = function({ colors }) {
  return new Chalk.constructor({ enabled: colors })
}

module.exports = {
  addChalk,
}
