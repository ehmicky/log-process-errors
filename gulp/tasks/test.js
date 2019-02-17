'use strict'

const { series } = require('gulp')

const { getWatchTask } = require('../utils')

const { check } = require('./check')
const { unit } = require('./unit')

const testTask = series(check, unit)

// eslint-disable-next-line fp/no-mutation
testTask.description = 'Lint and test source files'

const testwatch = getWatchTask({ CHECK: testTask }, testTask)

// eslint-disable-next-line fp/no-mutation
testwatch.description = 'Lint and test source files in watch mode'

module.exports = {
  test: testTask,
  testwatch,
}
