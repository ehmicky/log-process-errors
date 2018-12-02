'use strict'

const execa = require('execa')

const { isNyc, fireNyc } = require('./nyc')
const { ENV_VAR } = require('./constants')

// Fire main command
const fireCommand = async function({ command, packageRoot, buildDir }) {
  if (isNyc({ command })) {
    return fireNyc({ command, packageRoot, buildDir })
  }

  await execa.shell(command, { stdio: 'inherit', env: { [ENV_VAR]: buildDir } })
}

const DEFAULT_COMMAND = 'npm test'

module.exports = {
  fireCommand,
  DEFAULT_COMMAND,
}
