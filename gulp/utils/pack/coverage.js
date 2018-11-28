'use strict'

const {
  readFile,
  writeFile,
  access,
  constants: { R_OK, W_OK },
} = require('fs')
const { sep } = require('path')
const { promisify } = require('util')

const isNyc = function({ command }) {
  return command.startsWith('nyc ')
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

  const nestedDirRegExp = new RegExp(
    `node_modules\\${sep}${name}\\${sep}`,
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
  isNyc,
  fixNyc,
  fixCovMap,
}
