'use strict'

const { parallel } = require('gulp')

const { testwatch } = require('./test')

const dev = parallel(testwatch)

// eslint-disable-next-line fp/no-mutation
dev.description = 'Lint and test source files'

module.exports = {
  dev,
}
