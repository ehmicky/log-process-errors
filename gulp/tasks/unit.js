'use strict'

const isCi = require('is-ci')

const { getWatchTask } = require('../utils')
// eslint-disable-next-line import/no-internal-modules
const localpack = require('../utils/localpack')
const gulpExeca = require('../exec')

const unit = async function() {
  await localpack()

  if (!isCi) {
    return gulpExeca('ava')
  }

  return gulpExeca('nyc ava && coveralls <coverage/lcov.info')
}

// eslint-disable-next-line fp/no-mutation
unit.description = 'Run unit tests'

// We have to use this to debug Ava test files with Chrome devtools
const unitwatch = getWatchTask({ UNIT: unit }, unit)

// eslint-disable-next-line fp/no-mutation
unitwatch.description = 'Run unit tests in watch mode'

module.exports = {
  unit,
  unitwatch,
}
