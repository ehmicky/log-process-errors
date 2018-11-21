'use strict'

const { parallel } = require('gulp')

const { testwatch } = require('./test')
const { buildwatch } = require('./build')

const dev = parallel(testwatch, buildwatch)

// eslint-disable-next-line fp/no-mutation
dev.description = 'Lint, test and build source files'

module.exports = {
  dev,
}
