'use strict'

const { series } = require('gulp')

const { getWatchTask } = require('../utils')

const { test } = require('./test')
const { build } = require('./build')

const devTask = series(build, test)

const dev = getWatchTask({ DEV: devTask }, devTask)

// eslint-disable-next-line fp/no-mutation
dev.description = 'Lint, test and build source files'

module.exports = {
  dev,
}
