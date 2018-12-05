'use strict'

const { readFile, writeFile } = require('fs')
const { promisify } = require('util')

const isCi = require('is-ci')

const { getWatchTask } = require('../utils')
const gulpExeca = require('../exec')

const pReadFile = promisify(readFile)
const pWriteFile = promisify(writeFile)

const unit = async function() {
  if (!isCi) {
    return gulpExeca('ava')
  }

  await gulpExeca('nyc ava')

  await tempFix()

  await gulpExeca('coveralls --verbose <coverage/lcov.info')
}

const tempFix = async function() {
  const lcov = await pReadFile('coverage/lcov.info', { encoding: 'utf-8' })

  const lcovA = lcov.replace(/localpack\//gu, '')

  await pWriteFile('coverage/lcov.info', lcovA, { encoding: 'utf-8' })
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
