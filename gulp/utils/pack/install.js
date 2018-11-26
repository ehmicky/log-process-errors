'use strict'

const { unlink } = require('fs')
const { join } = require('path')
const { promisify } = require('util')
const { tmpdir } = require('os')

const execa = require('execa')

const { getPackageRoot, getManifest } = require('./root')
const { ENV_VAR } = require('./constants')

// Runs `npm pack && npm install tarball && rm tarball && command`
const pack = async function(command = DEFAULT_COMMAND) {
  const tarball = await createTarball()

  await installTarball({ tarball })

  await Promise.all([removeTarball({ tarball }), fireCommand({ command })])
}

const DEFAULT_COMMAND = 'npm test'

const createTarball = async function() {
  const tarballDir = tmpdir()

  const packageRoot = await getPackageRoot()

  await packTarball({ packageRoot, tarballDir })

  const tarball = getTarball({ packageRoot, tarballDir })
  return tarball
}

const packTarball = async function({ packageRoot, tarballDir }) {
  await execa.shell(`npm pack ${packageRoot}`, {
    stdout: 'ignore',
    cwd: tarballDir,
  })
}

const getTarball = function({ packageRoot, tarballDir }) {
  const { name, version } = getManifest({ packageRoot })
  const tarball = join(tarballDir, `${name}-${version}.tgz`)
  return tarball
}

// We don't need to support other package managers like yarn because:
//  - this command produces the same side-effects
//  - `npm` binary is always available
const installTarball = async function({ tarball }) {
  await execa.shell(`npm install --no-save --force ${tarball}`, {
    stdout: 'ignore',
  })
}

const removeTarball = async function({ tarball }) {
  await promisify(unlink)(tarball)
}

const fireCommand = async function({ command }) {
  await execa.shell(command, {
    stdout: 'inherit',
    env: { [ENV_VAR.NAME]: ENV_VAR.VALUE },
  })
}

module.exports = {
  pack,
}
