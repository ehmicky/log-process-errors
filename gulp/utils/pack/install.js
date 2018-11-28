'use strict'

const { unlink } = require('fs')
const { join } = require('path')
const { promisify } = require('util')
const { tmpdir } = require('os')

const execa = require('execa')

// Runs `npm pack && npm install tarball && rm tarball`
const install = async function({ packageRoot }) {
  const tarball = await createTarball({ packageRoot })

  await installTarball({ tarball })

  await removeTarball({ tarball })
}

const createTarball = async function({ packageRoot }) {
  const tarballDir = tmpdir()

  const tarballName = await packTarball({ packageRoot, tarballDir })

  const tarball = join(tarballDir, tarballName)
  return tarball
}

const packTarball = async function({ packageRoot, tarballDir }) {
  const { stdout } = await execa.shell(`npm pack --silent ${packageRoot}`, {
    stderr: 'inherit',
    cwd: tarballDir,
  })
  return stdout
}

// We don't need to support other package managers like yarn because:
//  - this command produces the same side-effects
//  - `npm` binary is always available
const installTarball = async function({ tarball }) {
  await execa.shell(`npm install --no-save --force ${tarball}`)
}

const removeTarball = async function({ tarball }) {
  await promisify(unlink)(tarball)
}

module.exports = {
  install,
}
