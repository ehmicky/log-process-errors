'use strict'

const { series } = require('gulp')

const { check } = require('./check')
const { unit } = require('./unit')

const testTask = series(check, unit)

module.exports = {
  test: testTask,
}
