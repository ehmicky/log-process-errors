'use strict'

const execa = require('execa')

const { ENV_VAR } = require('../constants')

const { getCommands } = require('./commands')
const { replaceCovMaps } = require('./covmap')

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

module.exports = {
  fireNyc,
}
