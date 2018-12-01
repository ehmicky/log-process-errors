'use strict'

const { env } = require('process')
const { resolve, isAbsolute, relative } = require('path')
const assert = require('assert')

const { getPackageRootSync } = require('./root')
const { ENV_VAR } = require('./constants')

// Require the package root directory.
// A `path` can be passed to require another file within that root directory.
// When run with `pack`, the package will first be packed with `npm pack` so
// that it is required the same way as on the npm repository.
// This help detecting problems in the package due to:
//  - missing files in the package (`.npmignore`, `files` field)
//  - wrong entry point (`main` or `browser` field)
//  - requiring `devDependencies` in production code
const load = function(path = '') {
  const file = getFile({ path })
  // eslint-disable-next-line import/no-dynamic-require
  return require(file)
}

const getFile = function({ path }) {
  const root = getRoot()
  const file = resolvePath({ root, path })
  return file
}

const getRoot = function() {
  if (env[ENV_VAR]) {
    return env[ENV_VAR]
  }

  return getPackageRootSync()
}

const resolvePath = function({ root, path }) {
  if (path === '') {
    return root
  }

  assert(!isAbsolute(path), `Path '${path}' must not be absolute`)

  const file = resolve(root, path)

  assert(
    !relative(root, file).startsWith('..'),
    `Path '${path}' must be inside '${root}'`,
  )

  return file
}

module.exports = {
  load,
}
