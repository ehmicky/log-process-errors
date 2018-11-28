'use strict'

const {
  unlink,
  readFile,
  writeFile,
  access,
  constants: { R_OK, W_OK },
} = require('fs')
const { join } = require('path')
const { promisify } = require('util')
const { tmpdir } = require('os')

const execa = require('execa')

const { getPackageInfo } = require('./root')
const { ENV_VAR } = require('./constants')

// Runs `npm pack && npm install tarball && rm tarball && command`
const pack = async function(command = DEFAULT_COMMAND) {
  const { packageRoot, name } = await getPackageInfo()

  const tarball = await createTarball({ packageRoot })

  await installTarball({ tarball })

  await Promise.all([
    removeTarball({ tarball }),
    fireCommand({ command, packageRoot, name }),
  ])
}

const DEFAULT_COMMAND = 'npm test'

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

const fireCommand = async function({ command, packageRoot, name }) {
  const commandA = await fixCommand({ command, packageRoot, name })

  await execa.shell(commandA, { stdio: 'inherit', env: { [ENV_VAR]: name } })

  await fixCovMap({ packageRoot, name })
}

const fixCommand = function({ command, packageRoot, name }) {
  if (command.startsWith('nyc ')) {
    return fixNyc({ command, packageRoot, name })
  }

  return command
}

// When using `pack`, tested files will be inside `node_modules/PACKAGE`.
// This won't work properly with nyc unless using `--cwd` flag.
// Otherwise those files will be ignored, and flags like `--all` won't work.
// We need to also specify `--report-dir` and `--temp-dir` to make sure those
// directories do not use `--cwd` flag location.
const fixNyc = function({ command, packageRoot, name }) {
  return command.replace(
    'nyc',
    `nyc --cwd ${packageRoot}/node_modules/${name} --report-dir ../../coverage --temp-dir ../../.nyc_output`,
  )
}

// We need to strip `node_modules/PACKAGE/` from file paths in coverage maps:
//   - so it looks like source files were in the same directory (not inside
//     `node_modules`).
//   - so file paths point to existing files in the filesystem.
//     Some tools like `coveralls` try to fetch content of files from the
//     coverage map. If they can't find them, they won't be reported.
const fixCovMap = async function({ packageRoot, name }) {
  const covMapPath = await getCovMapPath({ packageRoot })

  if (covMapPath === undefined) {
    return
  }

  const covMap = await promisify(readFile)(covMapPath, { encoding: 'utf-8' })

  // The RegExp needs to account for Windows having different separators.
  const nestedDirRegExp = new RegExp(
    `node_modules(\\/|\\\\)${name}(\\/|\\\\)`,
    'gu',
  )
  const covMapA = covMap.replace(nestedDirRegExp, '')

  await promisify(writeFile)(covMapPath, covMapA, { encoding: 'utf-8' })
}

// Retrieve coverage map location and make sure it exists.
const getCovMapPath = async function({ packageRoot }) {
  const covMapPath = `${packageRoot}/coverage/lcov.info`

  try {
    // eslint-disable-next-line no-bitwise
    await promisify(access)(covMapPath, R_OK | W_OK)
  } catch {}

  return covMapPath
}

module.exports = {
  pack,
}
