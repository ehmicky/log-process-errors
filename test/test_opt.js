'use strict'

const test = require('ava')
const execa = require('execa')

const { repeatEventsRunners, normalizeMessage } = require('./helpers')

const HELPER_DIR = `${__dirname}/helpers/test_opt`

const getHelperFile = function(testRunner) {
  // TODO: remove next comment once we support over test runners than 'ava'
  // istanbul ignore next
  const helperDir = testRunner === 'ava' ? __dirname : HELPER_DIR
  return `${helperDir}/${testRunner}.js`
}

// eslint-disable-next-line max-params
repeatEventsRunners((prefix, testRunner, { name }, defaultLevel) => {
  test(`${prefix} should make tests fails`, async t => {
    const helperFile = getHelperFile(testRunner)
    const options = {
      name,
      test: testRunner,
      // Tests whether `opts.level` can be overridden
      level: { default: defaultLevel },
    }
    const { stdout, stderr, code } = await execa(testRunner, [helperFile], {
      reject: false,
      env: { OPTIONS: JSON.stringify(options) },
    })

    const stdoutA = normalizeMessage(stdout)
    const stderrA = normalizeMessage(stderr)
    t.snapshot({ stdout: stdoutA, stderr: stderrA, code })
  })
})
