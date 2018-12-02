'use strict'

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

module.exports = {
  getCommands,
}
