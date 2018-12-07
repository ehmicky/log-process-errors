'use strict'

const assert = require('assert')

const pkgDir = require('pkg-dir')
const moize = require('moize').default

// Retrieve package root directory
const getPackageRoot = async function(cwd) {
  const packageRoot = await pkgDir(cwd)

  assert(
    packageRoot !== null,
    'The root directory of this package was not found',
  )

  return packageRoot
}

const mGetPackageRoot = moize(getPackageRoot)

module.exports = {
  getPackageRoot: mGetPackageRoot,
}
