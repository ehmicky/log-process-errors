import { dirname } from 'path'
import { fileURLToPath } from 'url'

import test from 'ava'
import { each } from 'test-each'

import { EVENTS } from '../helpers/events/main.js'
import { normalizeCall } from '../helpers/normalize.js'
import { removeProcessListeners } from '../helpers/remove.js'
import { RUNNERS } from '../helpers/testing/runners.js'

const HELPER_DIR = fileURLToPath(new URL('../helpers/testing', import.meta.url))
const AVA_HELPER_DIR = dirname(fileURLToPath(import.meta.url))

removeProcessListeners()

// Ava handling of rejectionHandled is not predictable, i.e. make tests
// randomly fail
const shouldSkip = function ({ runner, eventName }) {
  return runner === 'ava' && eventName === 'rejectionHandled'
}

const callRunner = async function ({ runner, command, env, eventName, opts }) {
  const helperDir = runner === 'ava' ? AVA_HELPER_DIR : HELPER_DIR
  const helperFile = `${helperDir}/${runner}`
  const optsA = { eventName, testing: runner, ...opts }
  const commandA = command(helperFile)
  const returnValue = await normalizeCall(commandA, {
    // Test runners have different CI output sometimes.
    env: { OPTIONS: JSON.stringify(optsA), CI: '1', ...env },
  })
  return returnValue
}

each(
  EVENTS,
  RUNNERS,
  ({ title }, { eventName }, { runner = title, command, env }) => {
    if (shouldSkip({ runner, eventName })) {
      return
    }

    test(`should make tests fails | ${title}`, async (t) => {
      const returnValue = await callRunner({
        runner,
        command,
        env,
        eventName,
      })

      t.snapshot(returnValue)
    })

    test(`should allow overriding 'opts.level' | ${title}`, async (t) => {
      const returnValue = await callRunner({
        runner,
        command,
        env,
        eventName,
        opts: { level: { default: 'silent' } },
      })

      t.snapshot(returnValue)
    })
  },
)
