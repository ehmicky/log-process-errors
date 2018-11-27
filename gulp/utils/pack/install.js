'use strict'

const { unlink } = require('fs')
const { join } = require('path')
const { promisify } = require('util')
const { tmpdir } = require('os')

const execa = require('execa')

const { getPackageInfo } = require('./root')
const { ENV_VAR } = require('./constants')

// Runs `npm pack && npm install tarball && rm tarball && command`
const pack = async function(command = DEFAULT_COMMAND) {
  const { packageRoot, name, version } = await getPackageInfo()

  const tarball = await createTarball({ packageRoot, name, version })

  await installTarball({ tarball })

  await Promise.all([
    removeTarball({ tarball }),
    fireCommand({ command, name }),
  ])
}

const DEFAULT_COMMAND = 'npm test'

const createTarball = async function({ packageRoot, name, version }) {
  const tarballDir = tmpdir()

  await packTarball({ packageRoot, tarballDir })

  const tarball = getTarball({ tarballDir, name, version })
  return tarball
}

const packTarball = async function({ packageRoot, tarballDir }) {
  await execa.shell(`npm pack ${packageRoot}`, {
    stdout: 'ignore',
    cwd: tarballDir,
  })
}

const getTarball = function({ tarballDir, name, version }) {
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

const fireCommand = async function({ command, name }) {
  await execa.shell(command, {
    stdout: 'inherit',
    env: { [ENV_VAR]: name },
  })
}

module.exports = {
  pack,
}
