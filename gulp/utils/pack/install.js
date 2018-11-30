'use strict'

const { unlink, rmdir, rename, realpath } = require('fs')
const { resolve } = require('path')
const { promisify } = require('util')
const { tmpdir } = require('os')

const execa = require('execa')
const { emptyDir } = require('fs-extra')
const tar = require('tar')

// Retrieve build directory.
// We must use a directory that is not a sibling or child so that requiring
// `devDependencies` fails.
const getBuildDir = async function({ name }) {
  const buildDirRoot = tmpdir()
  // Until https://github.com/istanbuljs/istanbuljs/issues/240 is resolved.
  const buildDirRootA = await promisify(realpath)(buildDirRoot)
  const buildDir = `${buildDirRootA}/${BUILD_DIR_NAME}/${name}`

  await emptyDir(buildDir)

  return buildDir
}

const BUILD_DIR_NAME = 'gulp_pack'

// Runs `npm pack`, unpack it to `buildDir`, then run `npm install` inside it.
const install = async function({ packageRoot, buildDir }) {
  const tarball = await createTarball({ packageRoot, buildDir })

  await extractTarball({ tarball, buildDir })

  await moveBuildDir({ tarball, buildDir })

  await installDeps({ buildDir })
}

const createTarball = async function({ packageRoot, buildDir }) {
  const { stdout } = await execa.shell(`npm pack --silent ${packageRoot}`, {
    stderr: 'inherit',
    cwd: buildDir,
  })

  const tarball = resolve(buildDir, stdout)
  return tarball
}

const extractTarball = async function({ tarball, buildDir }) {
  await tar.x({ file: tarball, cwd: buildDir })
}

// Tarball is unpacked to `${buildDir}/package`. We move it to parent directory.
const moveBuildDir = async function({ tarball, buildDir }) {
  // We need to use a temporary directory to replace a directory by one of its
  // children
  const tempDir = `${buildDir}-${Math.random()}`

  await promisify(rename)(`${buildDir}/package`, tempDir)
  await promisify(unlink)(tarball)
  await promisify(rmdir)(buildDir)
  await promisify(rename)(tempDir, buildDir)
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
  getBuildDir,
  install,
}
