'use strict'

const assert = require('assert')

const pkgDir = require('pkg-dir')
const moize = require('moize').default

const getPackageInfo = async function() {
  const packageRoot = await getPackageRoot()
  const { name, version } = getManifest({ packageRoot })
  return { packageRoot, name, version }
}

const getPackageRoot = async function() {
  const packageRoot = await pkgDir()
  checkPackageRoot({ packageRoot })
  return packageRoot
}

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

const getManifest = function({ packageRoot }) {
  // eslint-disable-next-line import/no-dynamic-require
  return require(`${packageRoot}/package.json`)
}

module.exports = {
  getPackageInfo,
  getPackageRootSync: mGetPackageRootSync,
}
