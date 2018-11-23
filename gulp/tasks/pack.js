'use strict'

const { rename, unlink } = require('fs')
const { promisify } = require('util')

const { extract } = require('tar')
const rimraf = require('rimraf')

const { name, version } = require('../../package')
const gulpExeca = require('../exec')

// We run tests on what's distributed by `npm publish`, in case we missed some
// files in the package.
const pack = async function() {
  // Create tarball
  await gulpExeca('npm pack', { stdout: 'ignore' })

  // Unzip tarball
  const file = `${name}-${version}.tgz`
  await extract({ file })

  // Remove previous directory and temporary files
  await Promise.all([promisify(unlink)(file), promisify(rimraf)('build')])

  // Rename directory
  await promisify(rename)('package', 'build')
}

// eslint-disable-next-line fp/no-mutation
pack.description = 'Run npm pack to create a build directory'

module.exports = {
  pack,
}
