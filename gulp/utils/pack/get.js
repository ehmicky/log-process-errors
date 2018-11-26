'use strict'

const { env } = require('process')

const { getPackageRootSync, getManifest } = require('./root')
const { ENV_VAR } = require('./constants')

// Retrieve the package root directory.
// When run with `pack`, the package will first be packed with `npm pack` so
// that it is required the same way as on the npm repository.
// This help detecting problems in the package due to:
//  - missing files in the package (`.npmignore`, `files` field)
//  - wrong entry point (`main` or `browser` field)
//  - requiring `devDependencies` in production code
const getPackage = function() {
  const packageRoot = getPackageRootSync()

  if (env[ENV_VAR.NAME] !== ENV_VAR.VALUE) {
    return packageRoot
  }

  const { name } = getManifest({ packageRoot })
  return name
}

module.exports = {
  getPackage,
}
