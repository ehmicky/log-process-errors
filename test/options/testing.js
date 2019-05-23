import { version } from 'process'

import test from 'ava'

import { repeatEventsRunners } from '../helpers/repeat.js'
import { normalizeCall } from '../helpers/normalize.js'
import { removeProcessListeners } from '../helpers/remove.js'

const HELPER_DIR = `${__dirname}/../helpers/testing`

removeProcessListeners()

const shouldSkip = function({ testName, eventName }) {
  return (
    isAvaRejectionHandled({ testName, eventName }) ||
    isOldNodeTap({ testName, eventName })
  )
}

// Ava handling of rejectionHandled is not predictable, i.e. make tests
// randomly fail
const isAvaRejectionHandled = function({ testName, eventName }) {
  return testName === 'ava' && eventName === 'rejectionHandled'
}

// `node-tap` testing is challenging for `rejectionHandled` and
// `unhandledRejection`. It fails but only locally (not in CI) and only for
// Node 8. Considering `node-tap` is doing lots of monkey-patching, we give up
// on testing that combination.
const isOldNodeTap = function({ testName, eventName }) {
  return (
    testName.startsWith('node-tap') &&
    ['rejectionHandled', 'unhandledRejection'].includes(eventName) &&
    version.startsWith('v8.')
  )
}

const callRunner = async function({
  testing,
  command,
  env,
  eventName,
  opts,
  register,
}) {
  const helperFile = getHelperFile({ testing, register })
  const optsA = { eventName, testing, ...opts }
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

repeatEventsRunners((prefix, { name: testName, command, env }, { eventName }) => {
  const [testing] = testName.split(':')

  if (shouldSkip({ testName, eventName })) {
    return
  }

  test(`${prefix} should make tests fails`, async t => {
    const returnValue = await callRunner({ testing, command, env, eventName })

    t.snapshot(returnValue)
  })

  test(`${prefix} should allow overriding 'opts.level'`, async t => {
    const returnValue = await callRunner({
      testing,
      command,
      env,
      eventName,
      opts: { level: { default: 'silent' } },
    })

    t.snapshot(returnValue)
  })

  test(`${prefix} should work with the -r flag`, async t => {
    const returnValue = await callRunner({
      testing,
      command,
      env,
      eventName,
      register: true,
    })

    t.snapshot(returnValue)
  })
})
