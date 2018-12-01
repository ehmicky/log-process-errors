'use strict'

const assert = require('assert')

const pkgDir = require('pkg-dir')
const moize = require('moize').default

// Retrieve package root directory
const getPackageRoot = async function() {
  const packageRoot = await pkgDir()
  checkPackageRoot({ packageRoot })
  return packageRoot
}

const mGetPackageRoot = moize(getPackageRoot)

const getPackageRootSync = function() {
  const packageRoot = pkgDir.sync()
  checkPackageRoot({ packageRoot })
  return packageRoot
}

const mGetPackageRootSync = moize(getPackageRootSync)

const checkPackageRoot = function({ packageRoot }) {
  assert(
    packageRoot !== null,
    'The root directory of this package was not found',
  )
}

module.exports = {
  getPackageRoot: mGetPackageRoot,
  getPackageRootSync: mGetPackageRootSync,
}
