import process, { nextTick, version } from 'node:process'
import { promisify } from 'node:util'

import test from 'ava'

// eslint-disable-next-line no-restricted-imports
import { EXIT_CODE, EXIT_TIMEOUT } from './exit.js'
import { emit } from './helpers/events.test.js'
import {
  startClockLogging,
  startExitLogging,
  startProcessLogging,
} from './helpers/exit.test.js'
import { removeProcessListeners } from './helpers/remove.test.js'

const pNextTick = promisify(nextTick)

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

const advanceClock = (t, clock) => {
  t.deepEqual(process.exit.args, [])
  clock.tick(EXIT_TIMEOUT)
  t.deepEqual(process.exit.args, [[EXIT_CODE]])
}

test.serial('call process.exit() after a timeout', async (t) => {
  const { clock, stopLogging } = startClockLogging({ exit: true })

  await emit('uncaughtException')
  advanceClock(t, clock)

  stopLogging()
})

test.serial('wait for async onError() before exiting', async (t) => {
  const onErrorDuration = 1e5
  const { clock, stopLogging } = startClockLogging({
    onError: async () => {
      await promisify(setTimeout)(onErrorDuration)
    },
    exit: true,
  })

  await emit('uncaughtException')
  clock.tick(onErrorDuration)
  await pNextTick()
  advanceClock(t, clock)

  stopLogging()
})

removeProcessListeners()
