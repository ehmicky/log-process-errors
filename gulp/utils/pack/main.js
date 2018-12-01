'use strict'

const { getPackageRoot } = require('./root')
const { getBuildDir, removeBuildDir } = require('./dir')
const { install } = require('./install')
const { fireCommand, DEFAULT_COMMAND } = require('./command')

// Runs command with `GULP_PACK_BUILD_DIR` environment variable pointing
// towards a built directory of itself (through `npm pack`)
const pack = async function(command = DEFAULT_COMMAND) {
  const [packageRoot, { buildBase, buildDir }] = await Promise.all([
    getPackageRoot(),
    getBuildDir(),
  ])

  try {
    await install({ packageRoot, buildBase, buildDir })

    await fireCommand({ command, packageRoot, buildDir })
  } finally {
    await removeBuildDir({ buildBase })
  }
}

module.exports = {
  pack,
}
