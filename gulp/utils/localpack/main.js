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

const getOutput = function({ packageRoot, output = `${packageRoot}/package` }) {
  return output
}

// Runs `npm pack` and unpack it to `packageDir`
const unpack = async function({ packageRoot, tempDir, output }) {
  const { stdout } = await execa.shell(`npm pack --silent ${packageRoot}`, {
    stderr: 'inherit',
    cwd: tempDir,
  })
  const tarball = resolve(tempDir, stdout)

  await tar.x({ file: tarball, cwd: tempDir })

  await pUnlink(tarball)

  await remove(output)

  await pRename(`${tempDir}/package`, output)
}

localpack()

module.exports = {
  localpack,
}
