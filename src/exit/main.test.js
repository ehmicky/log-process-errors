import process, { version } from 'node:process'

import test from 'ava'

import { emit } from '../helpers/events.test.js'
import { startExitLogging } from '../helpers/exit.test.js'
import { removeProcessListeners } from '../helpers/remove.test.js'

// eslint-disable-next-line no-restricted-imports
import { EXIT_CODE } from './main.js'

test.serial('exit process if "exit: true"', async (t) => {
  const stopLogging = startExitLogging({ exit: true })

  await emit('uncaughtException')
  t.is(process.exitCode, EXIT_CODE)

  stopLogging()
})

test.serial('does not exit process if "exit: false"', async (t) => {
  const stopLogging = startExitLogging({ exit: false })

  await emit('uncaughtException')
  t.is(process.exitCode, undefined)

  stopLogging()
})

test.serial('does not exit process if not an exit event', async (t) => {
  const stopLogging = startExitLogging({ exit: true })

  await emit('warning')
  t.is(process.exitCode, undefined)

  stopLogging()
})

test.serial(
  'does not exit process if unhandledRejection on Node 14',
  async (t) => {
    const stopLogging = startExitLogging({ exit: true })

    await emit('unhandledRejection')
    t.not(process.exitCode === EXIT_CODE, version.startsWith('v14.'))

    stopLogging()
  },
)

test.serial('exit process by default', async (t) => {
  const stopLogging = startExitLogging({ exit: undefined })

  await emit('uncaughtException')
  t.is(process.exitCode, EXIT_CODE)

  stopLogging()
})

removeProcessListeners()
