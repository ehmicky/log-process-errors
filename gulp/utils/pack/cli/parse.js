'use strict'

const { argv } = require('process')

const parseConfig = function({ yargs }) {
  yargs.parse()
  const command = argv.slice(2).join(' ')
  return command
}

module.exports = {
  parseConfig,
}
