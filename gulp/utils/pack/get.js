'use strict'

const { env } = require('process')

const { getPackageRootSync } = require('./root')
const { ENV_VAR } = require('./constants')

// Retrieve the package root directory.
// When run with `pack`, the package will first be packed with `npm pack` so
// that it is required the same way as on the npm repository.
// This help detecting problems in the package due to:
//  - missing files in the package (`.npmignore`, `files` field)
//  - wrong entry point (`main` or `browser` field)
//  - requiring `devDependencies` in production code
const getPackage = function() {
  if (env[ENV_VAR]) {
    return env[ENV_VAR]
  }

  return getPackageRootSync()
}

module.exports = {
  getPackage,
}
