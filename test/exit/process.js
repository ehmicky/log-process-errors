import process from 'process'

import test from 'ava'

// eslint-disable-next-line no-restricted-imports
import { EXIT_CODE } from '../../src/exit.js'
import { emit } from '../helpers/events.js'
import { startProcessLogging } from '../helpers/exit.js'
import { removeProcessListeners } from '../helpers/remove.js'

removeProcessListeners()

test.serial(
  'does not exit process by default if there are other listeners',
  async (t) => {
    const stopLogging = startProcessLogging('uncaughtException', {
      exit: undefined,
    })

    await emit('uncaughtException')
    t.is(process.exitCode, undefined)

    stopLogging()
  },
)

test.serial(
  'exits process if there are other listeners but "exit: true"',
  async (t) => {
    const stopLogging = startProcessLogging('uncaughtException', { exit: true })

    await emit('uncaughtException')
    t.is(process.exitCode, EXIT_CODE)

    stopLogging()
  },
)

test.serial(
  'exits process by default if there are other listeners for other events',
  async (t) => {
    const stopLogging = startProcessLogging('unhandledRejection', {
      exit: undefined,
    })

    await emit('uncaughtException')
    t.is(process.exitCode, EXIT_CODE)

    stopLogging()
  },
)

test.serial(
  'does not exit process by default if there are other listeners for other events but "exit: false"',
  async (t) => {
    const stopLogging = startProcessLogging('unhandledRejection', {
      exit: false,
    })

    await emit('uncaughtException')
    t.is(process.exitCode, undefined)

    stopLogging()
  },
)
