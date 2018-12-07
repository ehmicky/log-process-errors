'use strict'

const { exit } = require('process')

const localpack = require('../main')

const { defineCli } = require('./top')
const { parseConfig } = require('./parse')

const runCli = async function() {
  try {
    const yargs = defineCli()
    const config = parseConfig({ yargs })
    await localpack(config)
  } catch (error) {
    runCliHandler({ error })
  }
}

// If an error is thrown, print error's description, then exit with exit code 1
const runCliHandler = function({ error }) {
  const message = getMessage({ error }).trim()
  // eslint-disable-next-line no-console, no-restricted-globals
  console.error(message)

  exit(1)
}

const getMessage = function({ error }) {
  if (error && typeof error.message === 'string') {
    return error.message
  }

  return String(error)
}

module.exports = {
  runCli,
}
