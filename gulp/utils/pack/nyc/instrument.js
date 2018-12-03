'use strict'

const { isAbsolute, normalize, resolve } = require('path')

// Get main `nyc` instrumentation command
const getInstrumentCommand = function({ command, packageRoot, buildDir }) {
  // We need to `--clean` `temp-dir` so that we only fix the new coverage maps.
  // We need `--silent` since `nyc report` is done afterwards.
  const commandA = command.replace('nyc', 'nyc --clean --silent')
  const { command: commandB, 'temp-dir': avaTempDir } = patchOpts({
    command: commandA,
    packageRoot,
    buildDir,
  })
  return { instrument: commandB, avaTempDir }
}

// `--cwd` must be changed to `buildDir` for `--include`, `--exclude` and
// `--all` to work properly.
// However other options (`--temp-dir`, `--cache-dir`, `--report-dir`) are
// relative to `--cwd`, so we need to fix those so they point to `packageRoot`
// instead.
const patchOpts = function({ command, packageRoot, buildDir }) {
  return OPTIONS.reduce(
    (options, option) => patchOpt({ options, option, packageRoot, buildDir }),
    { command },
  )
}

// Modify a single `nyc` option
const patchOpt = function({
  options: { command, ...options },
  option: { name, getOpt, defValue },
  packageRoot,
  buildDir,
}) {
  const optValue = getOpt({ command, packageRoot, buildDir, name, defValue })
  const commandA = patchCommand({ command, optValue, name })
  return { ...options, [name]: optValue, command: commandA }
}

// Make a `nyc` option relative to `buildDir`
const getBuildDirOpt = function({ command, buildDir, name }) {
  const [, optValue = ''] = getOptRegExp({ name }).exec(command) || []

  // We do not allow those options to be outside `buildDir`
  if (isAbsolute(optValue) || normalize(optValue).startsWith('..')) {
    return buildDir
  }

  return resolve(buildDir, optValue)
}

// Make a `nyc` option relative to `packageRoot`
const getPackageRootOpt = function({ command, packageRoot, name, defValue }) {
  const [, optValue = defValue] = getOptRegExp({ name }).exec(command) || []

  // We allow those options to be outside `buildDir`
  if (isAbsolute(optValue)) {
    return
  }

  return resolve(packageRoot, optValue)
}

const patchCommand = function({ command, optValue, name }) {
  if (optValue === undefined) {
    return command
  }

  const hasOpt = getOptRegExp({ name }).test(command)

  // If the option is not explicitely present, prepend it
  if (!hasOpt) {
    return command.replace('nyc', `nyc --${name} ${optValue}`)
  }

  return command.replace(getOptRegExp({ name }), ` --${name} ${optValue}`)
}

// RegExp matching e.g. `--tmp-dir PATH`
const getOptRegExp = function({ name }) {
  return new RegExp(` --${name} ([^\\s]+)`, 'gu')
}

// All the options that must be fixed
const OPTIONS = [
  { name: 'cwd', getOpt: getBuildDirOpt },
  { name: 'temp-dir', getOpt: getPackageRootOpt, defValue: '.nyc_output' },
  { name: 'report-dir', getOpt: getPackageRootOpt, defValue: 'coverage' },
  {
    name: 'cache-dir',
    getOpt: getPackageRootOpt,
    defValue: 'node_modules/.cache/nyc',
  },
]

module.exports = {
  getInstrumentCommand,
}
