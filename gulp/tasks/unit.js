'use strict'

const isCi = require('is-ci')
const execa = require('execa')

const { getWatchTask } = require('../utils')
const gulpExeca = require('../exec')

const unit = async function() {
  if (!isCi) {
    return execa('./gulp/utils/pack/pack.js', ['ava'], { stdio: 'inherit' })
  }

  // TODO: separate pack into own repository, then use:
  //   await gulpExeca('pack nyc ava')
  await execa('./gulp/utils/pack/pack.js', ['nyc', 'ava'], { stdio: 'inherit' })

  await gulpExeca('coveralls <coverage/lcov.info')
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
