'use strict'

const { validate } = require('jest-validate')

const {
  applyDefaultLevels,
  getExampleLevels,
  validateLevels,
} = require('./level')
const { validateExitOn } = require('./exit')
const { defaultMessage } = require('./message')
const { defaultLog } = require('./log')
const { applyTestOpt, getExampleTestOpt } = require('./test_opt')
const { pickBy } = require('./utils')

// Validate options and assign default options
const getOptions = function({ opts = {} }) {
  const optsA = pickBy(opts, value => value !== undefined)

  validate(optsA, { exampleConfig: EXAMPLE_OPTS })
  validateOptions(optsA)

  const optsB = applyTestOpt({ opts: optsA })
  const level = applyDefaultLevels({ opts: optsB })
  const optsC = { ...DEFAULT_OPTS, ...optsB, level }
  return optsC
}

const DEFAULT_OPTS = {
  message: defaultMessage,
  log: defaultLog,
  colors: true,
  exitOn: ['uncaughtException'],
}

// `validate-jest` prints the function body
// eslint-disable-next-line no-empty-function
const exampleFunction = function() {}

const EXAMPLE_OPTS = {
  ...DEFAULT_OPTS,
  level: getExampleLevels(),
  message: exampleFunction,
  log: exampleFunction,
  test: getExampleTestOpt(),
}

// Validation beyond what `jest-validate` can do
const validateOptions = function({ exitOn, level = {} }) {
  validateLevels({ level })
  validateExitOn({ exitOn })
}

module.exports = {
  getOptions,
}
