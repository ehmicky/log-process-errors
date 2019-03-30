'use strict'

const { multipleValidOptions } = require('jest-validate')

const { RUNNERS } = require('./runners')

// Apply `options.testing` which is basically a preset of options.
const applyTesting = function({ opts, opts: { testing, level, ...optsA } }) {
  if (testing === undefined) {
    return opts
  }

  const testOpts = RUNNERS[testing]

  validateTesting({ testOpts, testing })
  validateTestOpts({ opts: optsA, testing })

  return {
    ...optsA,
    ...testOpts,
    // Users can override `level.default` but not the ones defined in `testOpts`
    level: { default: 'error', ...level, ...testOpts.level },
  }
}

const validateTesting = function({ testOpts, testing }) {
  if (testOpts !== undefined) {
    return
  }

  throw new Error(
    `Invalid option 'testing' '${testing}': must be one of ${Object.keys(
      RUNNERS,
    ).join(', ')}`,
  )
}

// Presets override other options. We make sure users do not assume their
// options are used when they are actually overriden.
// However we allow overriding preset's `level` so users can filter events.
const validateTestOpts = function({ opts, testing }) {
  const [optName] = Object.keys(opts)

  if (optName === undefined) {
    return
  }

  throw new Error(
    `Invalid option '${optName}': it must not be defined together with the option 'testing' '${testing}'`,
  )
}

// Use during options validation
const getExampleTesting = function() {
  return multipleValidOptions(...Object.keys(RUNNERS))
}

module.exports = {
  applyTesting,
  getExampleTesting,
}
