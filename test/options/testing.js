import test from 'ava'

import { repeatEventsRunners } from '../helpers/repeat.js'
import { normalizeCall } from '../helpers/normalize.js'
import { removeProcessListeners } from '../helpers/remove.js'

const HELPER_DIR = `${__dirname}/../helpers/testing`

removeProcessListeners()

repeatEventsRunners((prefix, { name: testName, command }, { name }) => {
  const [testing] = testName.split(':')

  test.serial(`${prefix} should make tests fails`, async t => {
    const returnValue = await callRunner({ testing, command, name })

    t.snapshot(returnValue)
  })

  test.serial(`${prefix} should allow overriding 'opts.level'`, async t => {
    const returnValue = await callRunner({
      testing,
      command,
      name,
      opts: { level: { default: 'silent' } },
    })

    t.snapshot(returnValue)
  })

  test.serial(`${prefix} should work with the -r flag`, async t => {
    const returnValue = await callRunner({
      testing,
      command,
      name,
      register: true,
    })

    t.snapshot(returnValue)
  })
})

const callRunner = async function({ testing, command, name, opts, register }) {
  const helperFile = getHelperFile({ testing, register })
  const optsA = { name, testing, ...opts }
  const commandA = command(helperFile)
  const returnValue = await normalizeCall(commandA, {
    // Test runners have different CI output sometimes.
    env: { OPTIONS: JSON.stringify(optsA), CI: '1' },
  })
  return returnValue
}

const getHelperFile = function({ testing, register }) {
  // TODO: remove next comment once we support over test runners than 'ava'
  // istanbul ignore next
  const helperDir = testing === 'ava' ? __dirname : HELPER_DIR
  const filename = register ? 'register' : 'regular'
  return `${helperDir}/${testing}/${filename}.js`
}
