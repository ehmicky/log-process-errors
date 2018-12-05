'use strict'

const { omitBy } = require('../utils')

const parseConfig = function({ yargs }) {
  const config = yargs.parse()
  const configA = omitBy(config, isInternalKey)
  return configA
}

// Remove `yargs`-specific options and shortcuts
const isInternalKey = function(key) {
  return INTERNAL_KEYS.includes(key) || key.length === 1
}

const INTERNAL_KEYS = ['help', 'version', '_', '$0']

module.exports = {
  parseConfig,
}
