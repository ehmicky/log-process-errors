'use strict'

const execa = require('execa')

const { getPackageInfo } = require('./root')
const { install } = require('./install')
const { isNyc, fixNyc, fixCovMap } = require('./coverage')
const { ENV_VAR } = require('./constants')

// Runs `npm pack && npm install tarball && rm tarball && command`
const pack = async function(command = DEFAULT_COMMAND) {
  const { packageRoot, name } = await getPackageInfo()

  await install({ packageRoot })

  await fireCommand({ command, packageRoot, name })
}

const DEFAULT_COMMAND = 'npm test'

const fireCommand = async function({ command, packageRoot, name }) {
  const commandA = await fixCommand({ command, packageRoot, name })

  await execa.shell(commandA, { stdio: 'inherit', env: { [ENV_VAR]: name } })

  await fixCovMap({ packageRoot, name })
}

const fixCommand = function({ command, packageRoot, name }) {
  if (isNyc({ command })) {
    return fixNyc({ command, packageRoot, name })
  }

  return command
}

module.exports = {
  pack,
}
