'use strict'

const { readFile, writeFile } = require('fs')
const { normalize } = require('path')
const { promisify } = require('util')

const execa = require('execa')

const { replaceAll, listFiles, escapeJsonString } = require('./utils')
const { ENV_VAR } = require('./constants')

const pReadFile = promisify(readFile)
const pWriteFile = promisify(writeFile)

// When using `nyc`, several things must be patched:
//  - tested files will be inside `buildDir`.
//    This won't work properly with nyc unless using `--cwd` flag.
//    Otherwise those files will be ignored, and flags like `--all` won't work.
//     - We need to also specify `--report|temp|cache-dir` to make sure those
//       directories do not use `buildDir`.
//  - we need to strip `buildDir` from file paths in coverage maps, because
//    tools (like `nyc` reporters and `coveralls`) require them to point to
//    source files that exist on the filesystem.
//     - this must be done after instrumentation but before reporting, i.e. we
//       need to break down `nyc` into
//       `nyc --silent && nyc report && nyc check-coverage`
const isNyc = function({ command }) {
  const [mainCommand, subCommand] = command.trim().split(/\s+/u)
  return mainCommand === 'nyc' && !NYC_SUB_COMMANDS.includes(subCommand)
}

// We only patch top-level `nyc` not `nyc instrument`, etc.
const NYC_SUB_COMMANDS = ['check-coverage', 'report', 'instrument', 'merge']

// Fire `nyc ...`
const fireNyc = async function({ command, packageRoot, buildDir }) {
  const { instrument, report, avaTempDir } = getCommands({
    command,
    packageRoot,
    buildDir,
  })

  await execa.shell(instrument, {
    stdio: 'inherit',
    env: { [ENV_VAR]: buildDir },
  })

  // Coverage maps must be patched between instrumentation and reporting
  await replaceCovMaps({ packageRoot, buildDir, avaTempDir })

  await execa.shell(report, { stdio: 'inherit' })
}

// Break down `nyc ...` into `nyc --silent` and
// `nyc report && nyc check-coverage`
const getCommands = function({ command, packageRoot, buildDir }) {
  const { hasCheckCoverage, command: commandA } = handleCheckCoverage({
    command,
  })

  const { instrument, avaTempDir } = getInstrumentCommand({
    command: commandA,
    packageRoot,
    buildDir,
  })

  const report = getReportCommand({ command: commandA, hasCheckCoverage })

  return { instrument, report, avaTempDir }
}

const handleCheckCoverage = function({ command }) {
  const commandA = command.replace(/ --check-coverage/gu, '')
  const hasCheckCoverage = command !== commandA
  return { hasCheckCoverage, command: commandA }
}

// Get main `nyc` instrumentation command
const getInstrumentCommand = function({ command, packageRoot, buildDir }) {
  const avaTempDir = `${packageRoot}/.nyc_output`
  const instrument = command.replace(
    'nyc',
    `nyc --clean --silent --cwd ${buildDir} --report-dir ${packageRoot}/coverage --temp-dir ${avaTempDir} --cache-dir ${packageRoot}/node_modules/.cache/nyc`,
  )
  return { instrument, avaTempDir }
}

// Get `nyc report [&& nyc check-coverage]` command
const getReportCommand = function({ command, hasCheckCoverage }) {
  const report = command.replace('nyc', 'nyc report')

  if (!hasCheckCoverage) {
    return report
  }

  const checkCoverage = command.replace('nyc', 'nyc check-coverage')
  // `nyc check-coverage` must be called after `nyc report` (as opposed to how
  // `nyc` actually works) to keep its exit code
  return `${report} && ${checkCoverage}`
}

// Replace coverage maps paths from `buildDir` to `packageRoot`
const replaceCovMaps = async function({ packageRoot, buildDir, avaTempDir }) {
  const files = await getCovMapsFiles({ avaTempDir })
  const promises = files.map(file =>
    replaceCovMap({ file, packageRoot, buildDir }),
  )
  await Promise.all(promises)
}

const getCovMapsFiles = async function({ avaTempDir }) {
  const [files, processTreeFiles] = await Promise.all([
    listFiles(avaTempDir, '.json'),
    // Used by `nyc --show-process-tree`
    listFiles(`${avaTempDir}/processinfo`, '.json'),
  ])
  return [...files, ...processTreeFiles]
}

const replaceCovMap = async function({ file, packageRoot, buildDir }) {
  // For Windows
  const buildDirA = normalize(buildDir)

  // Because we are replacing a non-parsed JSON file
  const buildDirB = escapeJsonString(buildDirA)
  const packageRootA = escapeJsonString(packageRoot)

  const covMap = await pReadFile(file, { encoding: 'utf-8' })
  const covMapA = replaceAll(covMap, buildDirB, packageRootA)
  await pWriteFile(file, covMapA, { encoding: 'utf-8' })
}

module.exports = {
  isNyc,
  fireNyc,
}
