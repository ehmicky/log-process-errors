'use strict'

const { resolve } = require('path')
const { unlink, rename } = require('fs')
const { promisify } = require('util')

const execa = require('execa')
const tar = require('tar')
const { remove } = require('fs-extra')

const pUnlink = promisify(unlink)
const pRename = promisify(rename)

// Runs `npm pack` and unpack it to `output`
const unpack = async function({ packageRoot, tempDir, output }) {
  await Promise.all([
    tempUnpack({ packageRoot, tempDir }),
    // Is silent when `output` does not exist
    remove(output),
  ])

  await pRename(`${tempDir}/package`, output)
}

const tempUnpack = async function({ packageRoot, tempDir }) {
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
}

module.exports = {
  unpack,
}
