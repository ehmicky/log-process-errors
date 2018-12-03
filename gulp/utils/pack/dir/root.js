'use strict'

const { realpath } = require('fs')
const { promisify } = require('util')
const { tmpdir } = require('os')

const moize = require('moize').default

const pRealpath = promisify(realpath)

// `buildRoot` is `/{tmpdir()}/gulp_pack`
const getBuildRoot = async function() {
  const buildRoot = tmpdir()
  // Until https://github.com/istanbuljs/istanbuljs/issues/240 is resolved.
  const buildRootA = await pRealpath(buildRoot)
  const buildRootB = `${buildRootA}/${BUILD_DIR_NAME}`
  return buildRootB
}

const mGetBuildRoot = moize(getBuildRoot)

const BUILD_DIR_NAME = 'gulp_pack'

module.exports = {
  getBuildRoot: mGetBuildRoot,
}
