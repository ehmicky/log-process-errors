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
  test(`${prefix} should make tests fails`, async t => {
    const helperFile = getHelperFile(testRunner)
    const { stdout, stderr, code } = await execa(testRunner, [helperFile], {
      reject: false,
      env: { EVENT_NAME: name },
    })

    const stdoutA = normalizeMessage(stdout)
    const stderrA = normalizeMessage(stderr)
    t.snapshot({ stdout: stdoutA, stderr: stderrA, code })
  })
})
