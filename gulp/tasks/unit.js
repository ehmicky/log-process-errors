'use strict'

const { readFile } = require('fs')
const { promisify } = require('util')

const { load: loadYaml } = require('js-yaml')
const isCi = require('is-ci')

const { name } = require('../../package.json')
const { getWatchTask, pack } = require('../utils')
const gulpExeca = require('../exec')

const TRAVIS_CONFIG = `${__dirname}/../../.travis.yml`

const unit = async function() {
  // In CI, we use `pack`, but not locally since it is slow.
  // Also, in CI we do test coverage and send it to Coveralls.
  if (!isCi) {
    return gulpExeca('ava')
  }

  // When using `pack`, tested files will be inside `node_modules`
  // By default `nyc` ignore those, so we need to add them to `--include``
  // Even after this, `node_modules` are still ignored by `nyc` unless using
  // a negated `--exclude`
  await pack(`nyc --include ${NESTED_DIR} --exclude !${NESTED_DIR} ava`)

  await sendToCoveralls()
}

// eslint-disable-next-line fp/no-mutation
unit.description = 'Run unit tests'

const sendToCoveralls = async function() {
  // We strip `node_modules/PACKAGE/` from test coverage reports so it looks
  // like source files were in the same directory (not inside `node_modules`).
  const covMap = await promisify(readFile)(COVMAP_PATH, { encoding: 'utf-8' })
  const covMapA = covMap.replace(NESTED_DIR_REGEXP, '')

  await gulpExeca('coveralls', { input: covMapA })
}

const NESTED_DIR = `node_modules/${name}`
// The RegExp needs to account for Windows having different separators.
const NESTED_DIR_REGEXP = new RegExp(
  `node_modules(\\/|\\\\)${name}(\\/|\\\\)`,
  'gu',
)
const COVMAP_PATH = './coverage/lcov.info'

// We have to use this to debug Ava test files with Chrome devtools
const unitwatch = getWatchTask({ UNIT: unit }, unit)

// eslint-disable-next-line fp/no-mutation
unitwatch.description = 'Run unit tests in watch mode'

const unitfull = async function() {
  const versions = await getNodeVersions()

  // eslint-disable-next-line fp/no-loops
  for (const version of versions) {
    // eslint-disable-next-line no-await-in-loop
    await gulpExeca(`. ${NVM_PATH} && nvm exec ${version} ava`)
  }
}

// Retrieve Node.js versions from Travis configuration
const getNodeVersions = async function() {
  const travisConfig = await promisify(readFile)(TRAVIS_CONFIG)
  const { node_js: versions = [] } = loadYaml(travisConfig)
  // eslint-disable-next-line fp/no-mutating-methods
  const versionsA = versions.sort().reverse()
  return versionsA
}

// `nvm` cannot be specified in package.json, i.e. must be installed manually
const NVM_PATH = '~/.nvm/nvm.sh'

// eslint-disable-next-line fp/no-mutation
unitfull.description = 'Run unit tests on all supported Node.js versions'

module.exports = {
  unit,
  unitwatch,
  unitfull,
}
