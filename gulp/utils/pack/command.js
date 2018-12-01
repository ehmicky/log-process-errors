'use strict'

const execa = require('execa')

const { isNyc, fixNyc, fixCovMap } = require('./coverage')
const { ENV_VAR } = require('./constants')

// Fire main command
const fireCommand = async function({ command, packageRoot, buildDir }) {
  const commandA = fixCommand({ command, packageRoot, buildDir })

  await execa.shell(commandA, {
    stdio: 'inherit',
    env: { [ENV_VAR]: buildDir },
  })

  await fixCovMap({ command: commandA, packageRoot, buildDir })
}

const fixCommand = function({ command, packageRoot, buildDir }) {
  if (isNyc({ command })) {
    return fixNyc({ command, packageRoot, buildDir })
  }

  return command
}

const DEFAULT_COMMAND = 'npm test'

module.exports = {
  fireCommand,
  DEFAULT_COMMAND,
}
