'use strict'

const test = require('ava')

const { repeatEventsRunners, normalizeCall } = require('./helpers')

const HELPER_DIR = `${__dirname}/helpers/test_opt`

repeatEventsRunners((prefix, testRunner, { name }) => {
  test(`${prefix} should make tests fails`, async t => {
    const helperFile = getHelperFile(testRunner)
    const options = { name, test: testRunner }
    const returnValue = await normalizeCall(testRunner, [helperFile], {
      env: { OPTIONS: JSON.stringify(options) },
    })

    t.snapshot(returnValue)
  })

  test(`${prefix} should allow overriding 'opts.level'`, async t => {
    const helperFile = getHelperFile(testRunner)
    const options = { name, test: testRunner, level: { default: 'silent' } }
    const returnValue = await normalizeCall(testRunner, [helperFile], {
      env: { OPTIONS: JSON.stringify(options) },
    })

    t.snapshot(returnValue)
  })

  test(`${prefix} should work with the -r flag`, async t => {
    const helperFile = getHelperFile(testRunner)
    const options = { name, test: testRunner, level: { default: 'silent' } }
    const returnValue = await normalizeCall(testRunner, [helperFile], {
      env: { OPTIONS: JSON.stringify(options) },
    })

    t.snapshot(returnValue)
  })
})

const getHelperFile = function(testRunner) {
  // TODO: remove next comment once we support over test runners than 'ava'
  // istanbul ignore next
  const helperDir = testRunner === 'ava' ? __dirname : HELPER_DIR
  return `${helperDir}/${testRunner}.js`
}
