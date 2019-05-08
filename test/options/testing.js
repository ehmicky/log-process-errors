import test from 'ava'

import { repeatEventsRunners } from '../helpers/repeat.js'
import { normalizeCall } from '../helpers/normalize.js'
import { removeProcessListeners } from '../helpers/remove.js'

const HELPER_DIR = `${__dirname}/../helpers/testing`

removeProcessListeners()

repeatEventsRunners((prefix, { name: testName, command, env }, { name }) => {
  const [testing] = testName.split(':')

  // Ava handling of rejectionHandled is not predictable, i.e. make tests
  // randomly fail
  if (testName === 'ava' && name === 'rejectionHandled') {
    return
  }

  test(`${prefix} should make tests fails`, async t => {
    const returnValue = await callRunner({ testing, command, env, name })

    t.snapshot(returnValue)
  })

  test(`${prefix} should allow overriding 'opts.level'`, async t => {
    const returnValue = await callRunner({
      testing,
      command,
      env,
      name,
      opts: { level: { default: 'silent' } },
    })

    t.snapshot(returnValue)
  })

  test(`${prefix} should work with the -r flag`, async t => {
    const returnValue = await callRunner({
      testing,
      command,
      env,
      name,
      register: true,
    })

    t.snapshot(returnValue)
  })
})

const callRunner = async function({
  testing,
  command,
  env,
  name,
  opts,
  register,
}) {
  const helperFile = getHelperFile({ testing, register })
  const optsA = { name, testing, ...opts }
  const commandA = command(helperFile)
  const returnValue = await normalizeCall(commandA, {
    // Test runners have different CI output sometimes.
    env: { OPTIONS: JSON.stringify(optsA), CI: '1', ...env },
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
