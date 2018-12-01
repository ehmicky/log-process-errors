'use strict'

const { realpath, mkdir } = require('fs')
const { promisify } = require('util')
const { tmpdir } = require('os')

const { remove } = require('fs-extra')
const moize = require('moize').default

// Retrieve build directory.
// We must use a directory that is not a sibling or child so that requiring
// `devDependencies` fails.
const getBuildDir = async function() {
  const buildBase = await getBuildBase()

  // Tarball is moved to `buildBase` but extracted to `buildDir`
  const buildDir = `${buildBase}/package`

  return { buildBase, buildDir }
}

const getBuildBase = async function() {
  const buildRoot = await mGetBuildRoot()
  const randomId = getRandomId()
  const buildBase = `${buildRoot}/${BUILD_DIR_NAME}/${randomId}`

  await promisify(mkdir)(buildBase, { recursive: true })

  return buildBase
}

const getBuildRoot = async function() {
  const buildRoot = tmpdir()
  // Until https://github.com/istanbuljs/istanbuljs/issues/240 is resolved.
  const buildRootA = await promisify(realpath)(buildRoot)
  return buildRootA
}

const mGetBuildRoot = moize(getBuildRoot)

// We create a new directory for each run so that parallel runs do not conflict
const getRandomId = function() {
  return String(Math.random()).replace('.', '')
}

const BUILD_DIR_NAME = 'gulp_pack'

// Final cleanup
const removeBuildDir = async function({ buildBase }) {
  await remove(buildBase)
}

module.exports = {
  getBuildDir,
  removeBuildDir,
}
