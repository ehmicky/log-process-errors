import process, { version, nextTick } from 'process'
import { promisify } from 'util'

import test from 'ava'
import logProcessErrors from 'log-process-errors'

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

const pNextTick = promisify(nextTick)

removeProcessListeners()

test.serial('call process.exit() after a timeout', async (t) => {
  const clock = stubProcessClock()
  const stopLogging = logProcessErrors({ log() {}, exit: true })

  await emit('uncaughtException')
  t.deepEqual(process.exit.args, [])
  clock.tick(EXIT_TIMEOUT)
  t.deepEqual(process.exit.args, [[EXIT_CODE]])

  stopLogging()
  unStubProcessClock(clock)
})

// eslint-disable-next-line max-statements
test.serial('wait for async log() before exiting', async (t) => {
  const clock = stubProcessClock()
  const logDuration = 1e5
  const stopLogging = logProcessErrors({
    async log() {
      await promisify(setTimeout)(logDuration)
    },
    exit: true,
  })

  await emit('uncaughtException')
  clock.tick(logDuration)
  await pNextTick()
  t.deepEqual(process.exit.args, [])
  clock.tick(EXIT_TIMEOUT)
  t.deepEqual(process.exit.args, [[EXIT_CODE]])

  stopLogging()
  unStubProcessClock(clock)
})

test.serial('exit process if "exit: true"', async (t) => {
  stubProcessExit()
  const stopLogging = logProcessErrors({ log() {}, exit: true })

  await emit('uncaughtException')
  t.is(process.exitCode, EXIT_CODE)

  stopLogging()
  unStubProcessExit()
})

test.serial('does not exit process if "exit: false"', async (t) => {
  stubProcessExit()
  const stopLogging = logProcessErrors({ log() {}, exit: false })

  await emit('uncaughtException')
  t.is(process.exitCode, undefined)

  stopLogging()
  unStubProcessExit()
})

test.serial('does not exit process if not an exit event', async (t) => {
  stubProcessExit()
  const stopLogging = logProcessErrors({ log() {}, exit: true })

  await emit('warning')
  t.is(process.exitCode, undefined)

  stopLogging()
  unStubProcessExit()
})

test.serial(
  'does not exit process if unhandledRejection on Node 14',
  async (t) => {
    stubProcessExit()
    const stopLogging = logProcessErrors({ log() {}, exit: true })

    await emit('unhandledRejection')
    t.is(process.exit.exitCode === EXIT_CODE, version.startsWith('v14.'))

    stopLogging()
    unStubProcessExit()
  },
)

test.serial('exit process by default', async (t) => {
  stubProcessExit()
  const stopLogging = logProcessErrors({ log() {} })

  await emit('uncaughtException')
  t.is(process.exitCode, EXIT_CODE)

  stopLogging()
  unStubProcessExit()
})

test.serial(
  'does not exit process by default if there are other listeners',
  async (t) => {
    stubProcessExit()
    const processHandler = setProcessEvent('uncaughtException')
    const stopLogging = logProcessErrors({ log() {} })

    await emit('uncaughtException')
    t.is(process.exitCode, undefined)

    unsetProcessEvent('uncaughtException', processHandler)
    stopLogging()
    unStubProcessExit()
  },
)

test.serial(
  'exits process if there are other listeners but "exit: true"',
  async (t) => {
    stubProcessExit()
    const processHandler = setProcessEvent('uncaughtException')
    const stopLogging = logProcessErrors({ log() {}, exit: true })

    await emit('uncaughtException')
    t.is(process.exitCode, EXIT_CODE)

    unsetProcessEvent('uncaughtException', processHandler)
    stopLogging()
    unStubProcessExit()
  },
)

test.serial(
  'exits process by default if there are other listeners for other events',
  async (t) => {
    stubProcessExit()
    const processHandler = setProcessEvent('unhandledRejection')
    const stopLogging = logProcessErrors({ log() {} })

    await emit('uncaughtException')
    t.is(process.exitCode, EXIT_CODE)

    unsetProcessEvent('unhandledRejection', processHandler)
    stopLogging()
    unStubProcessExit()
  },
)

test.serial(
  'does not exit process by default if there are other listeners for other events but "exit: false"',
  async (t) => {
    stubProcessExit()
    const processHandler = setProcessEvent('unhandledRejection')
    const stopLogging = logProcessErrors({ log() {}, exit: false })

    await emit('uncaughtException')
    t.is(process.exitCode, undefined)

    unsetProcessEvent('unhandledRejection', processHandler)
    stopLogging()
    unStubProcessExit()
  },
)
