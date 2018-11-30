'use strict'

const {
  readFile,
  writeFile,
  access,
  constants: { R_OK, W_OK },
} = require('fs')
const { normalize } = require('path')
const { promisify } = require('util')

const { replaceAll } = require('./utils')

// When using `pack`, tested files will be inside `buildDir`
// This won't work properly with nyc unless using `--cwd` flag.
// Otherwise those files will be ignored, and flags like `--all` won't work.
// We need to also specify `--report|temp|cache-dir` to make sure those
// directories do not use `buildDir`.
const isNyc = function({ command }) {
  return command.startsWith('nyc ')
}

const fixNyc = function({ command, packageRoot, buildDir }) {
  return command.replace(
    'nyc',
    `nyc --clean --cwd ${buildDir} --report-dir ${packageRoot}/coverage --temp-dir ${packageRoot}/.nyc_output --cache-dir ${packageRoot}/node_modules/.cache/nyc`,
  )
}

// We need to strip `buildDir` from file paths in coverage maps, because
// tools (like `nyc` reporters and `coveralls`) require them to point to
// source files that exist on the filesystem.
const fixCovMap = async function({ packageRoot, buildDir }) {
  const covMapPath = await getCovMapPath({ packageRoot })

  if (covMapPath === undefined) {
    return
  }

  // For Windows
  const buildDirA = normalize(buildDir)

  const covMap = await promisify(readFile)(covMapPath, { encoding: 'utf-8' })
  const covMapA = replaceAll(covMap, buildDirA, packageRoot)
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
