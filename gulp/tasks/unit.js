'use strict'

const { version } = require('process')
const { platform } = require('os')

const isCi = require('is-ci')

const { getWatchTask } = require('../utils')
const gulpExeca = require('../exec')

const unit = async function() {
  if (!isCi) {
    return gulpExeca('ava')
  }

  const os = PLATFORMS[platform()]
  // `codecov` only allows restricted characters
  const nodeVersion = `node_${version.replace(/\./gu, '_')}`
  await gulpExeca(
    `nyc ava && \
      curl -s https://codecov.io/bash > codecov && \
      bash codecov -f coverage/coverage-final.json -F ${os} -F ${nodeVersion} -Z && \
      rm codecov`,
  )
}

const PLATFORMS = {
  linux: 'linux',
  darwin: 'mac',
  win32: 'windows',
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
