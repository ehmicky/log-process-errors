'use strict'

const { omit, omitBy } = require('lodash')

const parseConfig = function({ yargs }) {
  // eslint-disable-next-line id-length
  const { _: command, ...config } = yargs.parse()

  // `yargs`-specific options
  const configA = omit(config, ['help', 'version', '$0'])

  // Remove shortcuts
  const configB = omitBy(configA, (value, name) => name.length === 1)

  const commandA = command.join(' ').trim()
  const commandB = commandA === '' ? undefined : commandA
  const configC = { ...configB, command: commandB }

  return configC
}

module.exports = {
  parseConfig,
}
