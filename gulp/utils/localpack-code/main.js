// eslint-disable-next-line filenames/match-exported
'use strict'

const { getCwd } = require('./cwd')
const { getPackageRoot } = require('./root')
const { getTempDir, cleanTempDir } = require('./temp')
const { unpack } = require('./unpack')
const { addDevChecks } = require('./dev_checks')

// Runs `npm pack` then unpack it to `opts.output`
const localpack = async function({ cwd, output } = {}) {
  const cwdA = await getCwd({ cwd })

  const [packageRoot, tempDir] = await Promise.all([
    getPackageRoot(cwdA),
    getTempDir(),
  ])

  const outputA = getOutput({ cwd: cwdA, output })

  await unpack({ packageRoot, tempDir, output: outputA })

  await Promise.all([
    addDevChecks({ output: outputA }),
    cleanTempDir({ tempDir }),
  ])
}

// Retrieve where package is unpacked
const getOutput = function({ cwd, output = `${cwd}/${DEFAULT_OUTPUT}` }) {
  return output
}

const DEFAULT_OUTPUT = 'localpack'

module.exports = localpack
