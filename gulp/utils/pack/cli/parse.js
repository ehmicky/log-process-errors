'use strict'

const { argv } = require('process')

const parseConfig = function({ yargs }) {
  // Handle --help and --version flags
  yargs.parse()
  const command = argv.slice(2).join(' ')
  return command
}

module.exports = {
  parseConfig,
}
