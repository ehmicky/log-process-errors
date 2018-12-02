'use strict'

const { readFile, writeFile } = require('fs')
const { normalize } = require('path')
const { promisify } = require('util')

const { replaceAll, fileExists } = require('./utils')

const pReadFile = promisify(readFile)
const pWriteFile = promisify(writeFile)

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
const fixCovMap = async function({ command, packageRoot, buildDir }) {
  if (!isNyc({ command })) {
    return
  }

  // Retrieve coverage map location and make sure it exists.
  const covMapPath = `${packageRoot}/coverage/lcov.info`

  const covMapExists = await fileExists({ path: covMapPath, readWrite: true })

  if (!covMapExists) {
    return
  }

  await substituteCovMap({ packageRoot, buildDir, covMapPath })
}

const substituteCovMap = async function({ packageRoot, buildDir, covMapPath }) {
  // For Windows
  const buildDirA = normalize(buildDir)

  const covMap = await pReadFile(covMapPath, { encoding: 'utf-8' })
  const covMapA = replaceAll(covMap, buildDirA, packageRoot)
  await pWriteFile(covMapPath, covMapA, { encoding: 'utf-8' })
}

module.exports = {
  isNyc,
  fixNyc,
  fixCovMap,
}
