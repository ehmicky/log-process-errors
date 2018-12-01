'use strict'

const { resolve } = require('path')

const execa = require('execa')
const tar = require('tar')

// Runs `npm pack`, unpack it to `buildDir`, then run `npm install` inside it.
const install = async function({ packageRoot, buildBase, buildDir }) {
  const tarball = await createTarball({ packageRoot, buildBase })

  await extractTarball({ tarball, buildBase })

  await installDeps({ buildDir })
}

const createTarball = async function({ packageRoot, buildBase }) {
  const { stdout } = await execa.shell(`npm pack --silent ${packageRoot}`, {
    stderr: 'inherit',
    cwd: buildBase,
  })

  const tarball = resolve(buildBase, stdout)
  return tarball
}

const extractTarball = async function({ tarball, buildBase }) {
  await tar.x({ file: tarball, cwd: buildBase })
}

// We don't need to support other package managers like yarn because:
//  - this command produces the same side-effects
//  - `npm` binary is always available
const installDeps = async function({ buildDir }) {
  await execa.shell('npm install --only=prod --no-package-lock', {
    cwd: buildDir,
  })
}

module.exports = {
  install,
}
