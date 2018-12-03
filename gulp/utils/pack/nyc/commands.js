'use strict'

const { getInstrumentCommand } = require('./instrument')

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

// We remove `--check-coverage` because `nyc check-coverage` is done afterwards.
const handleCheckCoverage = function({ command }) {
  const commandA = command.replace(CHECK_COVERAGE_REGEXP, '')
  const hasCheckCoverage = command !== commandA
  return { hasCheckCoverage, command: commandA }
}

const CHECK_COVERAGE_REGEXP = / --check-coverage/gu

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
