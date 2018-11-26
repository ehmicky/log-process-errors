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
  if (!isCi) {
    return gulpExeca('ava')
  }

  await pack(
    `nyc --include node_modules/${name} --exclude !node_modules/${name} ava`,
  )

  const content = await promisify(readFile)(COVMAP_PATH, { encoding: 'utf-8' })
  const contentA = content.replace(
    /node_modules(\/|\\)log-process-errors(\/|\\)/gu,
    '',
  )

  await gulpExeca('coveralls', { input: contentA })
}

const COVMAP_PATH = './coverage/lcov.info'

// eslint-disable-next-line fp/no-mutation
unit.description = 'Run unit tests'

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
