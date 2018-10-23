'use strict'

const { execCommand } = require('../utils')

const unit = function() {
  return execCommand('ava')
}

// eslint-disable-next-line fp/no-mutation
unit.description = 'Run unit tests'

const unitwatch = function() {
  // We have to use this to debug Ava test files with Chrome devtools
  return execCommand('ndb ava -w')
}

// eslint-disable-next-line fp/no-mutation
unitwatch.description = 'Run unit tests in watch mode'

module.exports = {
  unit,
  unitwatch,
}
