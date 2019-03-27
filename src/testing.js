'use strict'

const { multipleValidOptions } = require('jest-validate')

const { TEST_RUNNERS } = require('./test_runners')

// Apply `options.test` which is basically a preset of options.
const applyTestOpt = function({
  opts,
  opts: { test: testRunner, level, ...optsA },
}) {
  if (testRunner === undefined) {
    return opts
  }

  const testOpt = TEST_RUNNERS[testRunner]

  validateTestRunner({ testOpt, testRunner })
  validateTestOpts({ opts: optsA, testOpt, testRunner })

  return {
    ...optsA,
    ...testOpt,
    // Users can override `level.default` but not the ones defined in `testOpt`
    level: { default: 'error', ...level, ...testOpt.level },
  }
}

const validateTestRunner = function({ testOpt, testRunner }) {
  if (testOpt !== undefined) {
    return
  }

  throw new Error(
    `Invalid option 'test' '${testRunner}': must be one of ${Object.keys(
      TEST_RUNNERS,
    ).join(', ')}`,
  )
}

// Presets override other options. We make sure users do not assume their
// options are used when they are actually overriden.
// However we allow overriding preset's `level` so users can filter events.
const validateTestOpts = function({ opts, testOpt, testRunner }) {
  Object.keys(opts).forEach(optName =>
    validateTestOpt({ optName, testOpt, testRunner }),
  )
}

const validateTestOpt = function({ optName, testOpt, testRunner }) {
  if (testOpt[optName] === undefined) {
    return
  }

  throw new Error(
    `Invalid option '${optName}': it must not be defined together with the option 'test' '${testRunner}'`,
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
