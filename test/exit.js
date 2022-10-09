/* eslint-disable max-lines */
import process, { version, nextTick } from 'process'
import { promisify } from 'util'

import test from 'ava'

// eslint-disable-next-line no-restricted-imports
import { EXIT_TIMEOUT, EXIT_CODE } from '../src/exit.js'

import { emit } from './helpers/events.js'
import {
  stubProcessClock,
  stubProcessExit,
  unStubProcessClock,
  unStubProcessExit,
} from './helpers/exit.js'
import { setProcessEvent, unsetProcessEvent } from './helpers/process.js'
import { removeProcessListeners } from './helpers/remove.js'
import { startLogging } from './helpers/start.js'

const pNextTick = promisify(nextTick)
removeProcessListeners()

const startExitLogging = function (opts) {
  stubProcessExit()
  return stopExitLogging.bind(undefined, startLogging(opts).stopLogging)
}

const stopExitLogging = function (stopLogging) {
  stopLogging()
  unStubProcessExit()
}

test.serial('call process.exit() after a timeout', async (t) => {
  const clock = stubProcessClock()
  const { stopLogging } = startLogging({ exit: true })

  await emit('uncaughtException')
  t.deepEqual(process.exit.args, [])
  clock.tick(EXIT_TIMEOUT)
  t.deepEqual(process.exit.args, [[EXIT_CODE]])

  stopLogging()
  unStubProcessClock(clock)
})

// eslint-disable-next-line max-statements
test.serial('wait for async onError() before exiting', async (t) => {
  const clock = stubProcessClock()
  const onErrorDuration = 1e5
  const { stopLogging } = startLogging({
    async onError() {
      await promisify(setTimeout)(onErrorDuration)
    },
    exit: true,
  })

  await emit('uncaughtException')
  clock.tick(onErrorDuration)
  await pNextTick()
  t.deepEqual(process.exit.args, [])
  clock.tick(EXIT_TIMEOUT)
  t.deepEqual(process.exit.args, [[EXIT_CODE]])

  stopLogging()
  unStubProcessClock(clock)
})

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
    t.is(process.exit.exitCode === EXIT_CODE, version.startsWith('v14.'))

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
    const processHandler = setProcessEvent('uncaughtException')
    const stopLogging = startExitLogging({ exit: undefined })

    await emit('uncaughtException')
    t.is(process.exitCode, undefined)

    stopLogging()
    unsetProcessEvent('uncaughtException', processHandler)
  },
)

test.serial(
  'exits process if there are other listeners but "exit: true"',
  async (t) => {
    const processHandler = setProcessEvent('uncaughtException')
    const stopLogging = startExitLogging({ exit: true })

    await emit('uncaughtException')
    t.is(process.exitCode, EXIT_CODE)

    stopLogging()
    unsetProcessEvent('uncaughtException', processHandler)
  },
)

test.serial(
  'exits process by default if there are other listeners for other events',
  async (t) => {
    const processHandler = setProcessEvent('unhandledRejection')
    const stopLogging = startExitLogging({ exit: undefined })

    await emit('uncaughtException')
    t.is(process.exitCode, EXIT_CODE)

    stopLogging()
    unsetProcessEvent('unhandledRejection', processHandler)
  },
)

test.serial(
  'does not exit process by default if there are other listeners for other events but "exit: false"',
  async (t) => {
    const processHandler = setProcessEvent('unhandledRejection')
    const stopLogging = startExitLogging({ exit: false })

    await emit('uncaughtException')
    t.is(process.exitCode, undefined)

    stopLogging()
    unsetProcessEvent('unhandledRejection', processHandler)
  },
)
