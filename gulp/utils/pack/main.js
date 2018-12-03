'use strict'

const { getPackageRoot } = require('./root')
const { getBuildDir } = require('./dir')
const { findSiblings } = require('./siblings')
const { unpack } = require('./unpack')
const { installDeps, cacheDeps } = require('./install')
const { fireCommand, DEFAULT_COMMAND } = require('./command')
const { removeBuildDir, removeSiblings } = require('./cleanup')

// Runs command with `GULP_PACK_BUILD_DIR` environment variable pointing
// towards a built directory of itself (through `npm pack`)
const pack = async function(command = DEFAULT_COMMAND) {
  const packageRoot = await getPackageRoot()

  const { buildRoot, buildBase, buildDir, name, hash } = await getBuildDir({
    packageRoot,
  })

  const { siblings, cachedModules } = await findSiblings({
    buildRoot,
    name,
    hash,
  })

  await unpack({ packageRoot, buildBase })

  try {
    await installDeps({ buildDir, cachedModules })

    await Promise.all([
      cacheDeps({ buildBase, buildDir }),
      fireCommand({ command, packageRoot, buildDir }),
      removeSiblings({ siblings, name }),
    ])
  } finally {
    await removeBuildDir({ buildDir })
  }
}

module.exports = {
  pack,
}
