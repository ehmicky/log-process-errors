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

// TODO: use packageRoot instead of process.cwd()?
const fireCommand = async function({ command, name }) {
  const commandA = await fixTestCoverage({ command, name })

  await execa.shell(commandA, {
    stdout: 'inherit',
    env: { [ENV_VAR]: name },
  })

  await fixCovMap({ name })
}

// When using `pack`, tested files will be inside `node_modules/PACKAGE`,
// so we need to use nyc --cwd:
//  - otherwise they will be ignored
//  - also other nyc logic should consider `node_modules/PACKAGE` as if it
//    was the top directory, e.g. `--all` flag.
const fixTestCoverage = function({ command, name }) {
  if (command.startsWith('nyc ')) {
    return command.replace(
      'nyc',
      `nyc --cwd node_modules/${name} --report-dir ../../coverage --temp-dir ../../.nyc_output`,
    )
  }

  return command
}

// We need to strip `node_modules/PACKAGE/` from test coverage reports.
// Reasons:
//   - `coveralls` tries to fetch source files (after source maps has been
//     applied), i.e. it will try to find them inside `node_modules/PACKAGE/`.
//     Since it won't find them, they won't be reported.
//   - so it looks like source files were in the same directory (not inside
//     `node_modules`).
// Some tools like coveralls will otherwise show wrong reporting.
const fixCovMap = async function({ name }) {
  const covMapPath = await getCovMapPath()

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

const getCovMapPath = async function() {
  const covMapPath = './coverage/lcov.info'

  try {
    await promisify(access)(covMapPath, READ_WRITE)
  } catch {}

  return covMapPath
}

// eslint-disable-next-line no-bitwise
const READ_WRITE = R_OK | W_OK

module.exports = {
  pack,
}
