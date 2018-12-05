// eslint-disable-next-line filenames/match-exported
'use strict'

const { getPackageRoot } = require('./root')
const { getTempDir, cleanTempDir } = require('./temp')
const { unpack } = require('./unpack')
const { addDevChecks } = require('./dev_checks')

// Runs `npm pack` then unpack it to `opts.output`
const localpack = async function({ output } = {}) {
  const [packageRoot, tempDir] = await Promise.all([
    getPackageRoot(),
    getTempDir(),
  ])

  const outputA = getOutput({ packageRoot, output })

  await unpack({ packageRoot, tempDir, output: outputA })

  await Promise.all([
    addDevChecks({ output: outputA }),
    cleanTempDir({ tempDir }),
  ])
}

// Retrieve where package is unpacked
const getOutput = function({
  packageRoot,
  output = `${packageRoot}/${DEFAULT_OUTPUT}`,
}) {
  return output
}

const DEFAULT_OUTPUT = 'localpack'

module.exports = localpack
