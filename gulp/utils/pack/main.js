'use strict'

const execa = require('execa')

const { getPackageInfo } = require('./root')
const { getBuildDir, install } = require('./install')
const { isNyc, fixNyc, fixCovMap } = require('./coverage')
const { ENV_VAR } = require('./constants')

// Runs command with `GULP_PACK_BUILD_DIR` environment variable pointing
// towards a built directory of itself (through `npm pack`)
const pack = async function(command = DEFAULT_COMMAND) {
  const { packageRoot, name } = await getPackageInfo()

  const buildDir = await getBuildDir({ name })

  await install({ packageRoot, buildDir })

  await fireCommand({ command, packageRoot, buildDir })
}

const DEFAULT_COMMAND = 'npm test'

const fireCommand = async function({ command, packageRoot, buildDir }) {
  const commandA = fixCommand({ command, packageRoot, buildDir })

  await execa.shell(commandA, {
    stdio: 'inherit',
    env: { [ENV_VAR]: buildDir },
  })

  await fixCovMap({ packageRoot, buildDir })
}

const fixCommand = function({ command, packageRoot, buildDir }) {
  if (isNyc({ command })) {
    return fixNyc({ command, packageRoot, buildDir })
  }

  return command
}

module.exports = {
  pack,
}
