'use strict'

const { multipleValidOptions } = require('jest-validate')

const { TEST_RUNNERS } = require('./test_runners')

// Apply `options.test` which is basically a preset of options.
const applyTestOpt = function({ opts, opts: { test: testName, level } }) {
  if (testName === undefined) {
    return opts
  }

  const testOpt = TEST_RUNNERS[testName]

  validateTestName({ testOpt, testName })
  validateTestOpts({ opts, testOpt, testName })

  return { ...opts, ...testOpt, level: { ...level, ...testOpt.level } }
}

const validateTestName = function({ testOpt, testName }) {
  if (testOpt !== undefined) {
    return
  }

  throw new Error(
    `Invalid option 'test' '${testName}': must be one of ${Object.keys(
      TEST_RUNNERS,
    ).join(', ')}`,
  )
}

// Presets override other options. We make sure users do not assume their
// options are used when they are actually overriden.
// However we allow overriding preset's `level` so users can filter events.
const validateTestOpts = function({ opts, testOpt, testName }) {
  Object.keys(opts).forEach(optName =>
    validateTestOpt({ optName, testOpt, testName }),
  )
}

const validateTestOpt = function({ optName, testOpt, testName }) {
  if (testOpt[optName] === undefined || optName === 'level') {
    return
  }

  throw new Error(
    `Invalid option '${optName}': it must not be defined together with the option 'test' '${testName}'`,
  )
}

// Use during options validation
const getExampleTestOpt = function() {
  return multipleValidOptions(...Object.keys(TEST_RUNNERS))
}

module.exports = {
  applyTestOpt,
  getExampleTestOpt,
}
