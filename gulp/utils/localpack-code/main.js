// eslint-disable-next-line filenames/match-exported
'use strict'

const { resolve } = require('path')
const { unlink, rename } = require('fs')
const { promisify } = require('util')

const execa = require('execa')
const tar = require('tar')
const { remove } = require('fs-extra')

const pUnlink = promisify(unlink)
const pRename = promisify(rename)

const { getPackageRoot } = require('./root')
const { getTempDir, cleanTempDir } = require('./temp')

// Runs `npm pack` then unpack it to `opts.output`
const localpack = async function({ output } = {}) {
  const [packageRoot, tempDir] = await Promise.all([
    getPackageRoot(),
    getTempDir(),
  ])

  const outputA = getOutput({ packageRoot, output })

  await unpack({ packageRoot, tempDir, output: outputA })

  await cleanTempDir({ tempDir })
}

const getOutput = function({
  packageRoot,
  output = `${packageRoot}/${DEFAULT_OUTPUT}`,
}) {
  return output
}

const DEFAULT_OUTPUT = 'localpack'

// Runs `npm pack` and unpack it to `output`
const unpack = async function({ packageRoot, tempDir, output }) {
  // We use `npm pack` instead of `require('./npm/lib/pack')`:
  //  - to use the same `npm` version as the one globally installed,
  //    so it mirrors what will be published
  //  - to make code less likely to change with npm internal changes
  // However this means this next line is 4 times slower (because it creates
  // a new process)
  const { stdout } = await execa.shell(
    `npm pack --silent --no-update-notifier ${packageRoot}`,
    { stderr: 'inherit', cwd: tempDir },
  )
  const tarball = resolve(tempDir, stdout)

  await tar.x({ file: tarball, cwd: tempDir })

  await pUnlink(tarball)

  // Is silent when `output` does not exist
  await remove(output)

  await pRename(`${tempDir}/package`, output)
}

module.exports = localpack
