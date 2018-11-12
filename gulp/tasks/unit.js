'use strict'

const { readFile } = require('fs')
const { promisify } = require('util')

const { load: loadYaml } = require('js-yaml')

const { execCommand } = require('../utils')

const TRAVIS_CONFIG = `${__dirname}/../../.travis.yml`

const unit = function() {
  return execCommand('ava')
}

// eslint-disable-next-line fp/no-mutation
unit.description = 'Run unit tests'

const unitwatch = function() {
  // We have to use this to debug Ava test files with Chrome devtools
  return execCommand('ndb ava -w')
}

// eslint-disable-next-line fp/no-mutation
unitwatch.description = 'Run unit tests in watch mode'

const unitfull = async function() {
  const versions = await getNodeVersions()

  // eslint-disable-next-line fp/no-loops
  for (const version of versions) {
    // eslint-disable-next-line no-await-in-loop
    await execCommand(`. ${NVM_PATH} && nvm exec ${version} ava`, {
      shell: true,
    })
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
unit.description = 'Run unit tests on all supported Node.js versions'

module.exports = {
  unit,
  unitwatch,
  unitfull,
}
