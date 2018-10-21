'use strict'

const { series, parallel } = require('gulp')

const { check, checkwatch } = require('./check')
const { unit, unitwatch } = require('./unit')

const testTask = series(check, unit)

// eslint-disable-next-line fp/no-mutation
testTask.description = 'Lint and test source files'

const testwatch = parallel(checkwatch, unitwatch)

// eslint-disable-next-line fp/no-mutation
testwatch.description = 'Lint and test source files in watch mode'

module.exports = {
  test: testTask,
  testwatch,
}
