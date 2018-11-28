'use strict'

const { exit } = require('process')

const { pack } = require('../main')

const { defineCli } = require('./top')
const { parseConfig } = require('./parse')

const runCli = async function() {
  try {
    const yargs = defineCli()
    const { command } = parseConfig({ yargs })
    await pack(command)
  } catch (error) {
    runCliHandler(error)
  }
}

// If an error is thrown, print error's description, then exit with exit code 1
const runCliHandler = function(error) {
  // eslint-disable-next-line no-console, no-restricted-globals
  console.error(error)

  exit(1)
}

module.exports = {
  runCli,
}
