'use strict'

const test = require('ava')

const { repeatEventsRunners, normalizeCall } = require('../helpers')

const HELPER_DIR = `${__dirname}/../helpers/testing`

repeatEventsRunners((prefix, testing, { name }) => {
  test(`${prefix} should make tests fails`, async t => {
    const returnValue = await callRunner({ testing, name })

    t.snapshot(returnValue)
  })

  test(`${prefix} should allow overriding 'opts.level'`, async t => {
    const returnValue = await callRunner(
      { testing, name },
      { level: { default: 'silent' } },
    )

    t.snapshot(returnValue)
  })

  test(`${prefix} should allow overriding options not specified by runner`, async t => {
    const returnValue = await callRunner(
      { testing, name },
      { message: 'test message' },
    )

    t.snapshot(returnValue)
  })

  test(`${prefix} should work with the -r flag`, async t => {
    const returnValue = await callRunner({ testing, name }, { register: true })

    t.snapshot(returnValue)
  })
})

const callRunner = async function({ testing, name }, opts) {
  const helperFile = getHelperFile(testing)
  const optsA = { name, testing, ...opts }
  const { [testing]: command = defaultGetCommand } = COMMANDS
  const commandA = command(testing, helperFile)
  const returnValue = await normalizeCall(commandA, {
    env: { OPTIONS: JSON.stringify(optsA) },
  })
  return returnValue
}

const getHelperFile = function(testing) {
  // TODO: remove next comment once we support over test runners than 'ava'
  // istanbul ignore next
  const helperDir = testing === 'ava' ? __dirname : HELPER_DIR
  return `${helperDir}/${testing}.js`
}

const COMMANDS = {
  // Jasmine add random seeds to output otherwise
  // eslint-disable-next-line unicorn/no-unused-properties
  jasmine(testing, helperFile) {
    return `${testing} --seed=0 ${helperFile}`
  },
}

const defaultGetCommand = function(testing, helperFile) {
  return `${testing} ${helperFile}`
}
