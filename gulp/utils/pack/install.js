'use strict'

const { rename } = require('fs')
const { promisify } = require('util')

const execa = require('execa')
const { copy } = require('fs-extra')

const pRename = promisify(rename)

// Run `npm install`.
// If a cached previous run `node_modules` can be used, copy it instead, as this
// is much faster.
const installDeps = function({ buildDir, cachedModules }) {
  if (cachedModules !== undefined) {
    return copyCachedModules({ buildDir, cachedModules })
  }

  return npmInstall({ buildDir })
}

const copyCachedModules = async function({ buildDir, cachedModules }) {
  // Note that `node_modules` might already exist if there are
  // `bundledDependencies` in which case they will be overwritten (which is ok)
  await copy(cachedModules, `${buildDir}/node_modules`)
}

// We don't need to support other package managers like yarn because:
//  - this command produces the same side-effects
//  - `npm` binary is always available
const npmInstall = async function({ buildDir }) {
  await execa.shell('npm install --only=prod --no-package-lock', {
    cwd: buildDir,
  })
}

// Copy `buildDir/node_modules` to `buildBase/modules`, which is what's used
// by other runs for caching.
// We use a temporary file so that creating `buildBase/modules` is atomic.
// Otherwise a concurrent run using it might get a partial directory.
const cacheDeps = async function({ buildBase, buildDir, cachedModules }) {
  // If this run used caching, we do not create a new `buildBase/modules` since
  // one already exists
  if (cachedModules !== undefined) {
    return
  }

  await copy(`${buildDir}/node_modules`, `${buildBase}/modules_temp`, {
    overwrite: false,
    errorOnExist: true,
  })
  await pRename(`${buildBase}/modules_temp`, `${buildBase}/modules`)
}

module.exports = {
  installDeps,
  cacheDeps,
}
