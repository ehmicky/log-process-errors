'use strict'

const { resolve } = require('path')
const { mkdir, unlink } = require('fs')
const { promisify } = require('util')

const execa = require('execa')
const tar = require('tar')

const pMkdir = promisify(mkdir)
const pUnlink = promisify(unlink)

// Runs `npm pack` and unpack it to `buildDir`
const unpack = async function({ packageRoot, buildBase }) {
  await pMkdir(buildBase)

  const tarball = await createTarball({ packageRoot, buildBase })

  await extractTarball({ tarball, buildBase })

  await pUnlink(tarball)
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

module.exports = {
  unpack,
}
