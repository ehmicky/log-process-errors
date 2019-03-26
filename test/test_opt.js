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

repeatEventsRunners((prefix, testRunner, { name }) => {
  // `defaultLevel` tests whether `opts.level` can be overridden
  ;['error', 'silent'].forEach(defaultLevel => {
    // eslint-disable-next-line max-nested-callbacks
    test(`${prefix} [${defaultLevel}] should make tests fails`, async t => {
      const helperFile = getHelperFile(testRunner)
      const options = {
        name,
        test: testRunner,
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
})
