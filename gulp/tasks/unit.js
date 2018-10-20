'use strict'

const { execCommand } = require('../utils')

const unit = function() {
  return execCommand('ava')
}

// eslint-disable-next-line fp/no-mutation
unit.description = 'Run unit tests'

const unitwatch = function() {
  return execCommand('ava -w')
}

// eslint-disable-next-line fp/no-mutation
unitwatch.description = 'Run unit tests in watch mode'

module.exports = {
  unit,
  unitwatch,
}
