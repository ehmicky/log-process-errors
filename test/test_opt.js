'use strict'

const test = require('ava')

const { repeatEventsRunners, normalizeCall } = require('./helpers')

const HELPER_DIR = `${__dirname}/helpers/test_opt`

repeatEventsRunners((prefix, testRunner, { name }) => {
  test(`${prefix} should make tests fails`, async t => {
    const returnValue = await callRunner({ testRunner, name })

    t.snapshot(returnValue)
  })

  test(`${prefix} should allow overriding 'opts.level'`, async t => {
    const returnValue = await callRunner(
      { testRunner, name },
      { level: { default: 'silent' } },
    )

    t.snapshot(returnValue)
  })

  test(`${prefix} should work with the -r flag`, async t => {
    const returnValue = await callRunner(
      { testRunner, name },
      { register: true },
    )

    t.snapshot(returnValue)
  })
})

const callRunner = async function({ testRunner, name }, opts) {
  const helperFile = getHelperFile(testRunner)
  const optsA = { name, test: testRunner, ...opts }
  const returnValue = await normalizeCall(testRunner, [helperFile], {
    env: { OPTIONS: JSON.stringify(optsA) },
  })
  return returnValue
}

const getHelperFile = function(testRunner) {
  // TODO: remove next comment once we support over test runners than 'ava'
  // istanbul ignore next
  const helperDir = testRunner === 'ava' ? __dirname : HELPER_DIR
  return `${helperDir}/${testRunner}.js`
}
