import process, { version, nextTick } from 'process'
import { promisify } from 'util'

import fakeTimers from '@sinonjs/fake-timers'
import test from 'ava'
import logProcessErrors from 'log-process-errors'
import sinon from 'sinon'

// eslint-disable-next-line no-restricted-imports
import { EXIT_TIMEOUT, EXIT_CODE } from '../src/exit.js'

import { EVENTS_MAP } from './helpers/events.js'
import { removeProcessListeners } from './helpers/remove.js'

const pNextTick = promisify(nextTick)

removeProcessListeners()

const stubProcessExit = function () {
  sinon.stub(process, 'exit')
}

const unStubProcessExit = function () {
  process.exit.restore()
  process.exitCode = undefined
}

test.serial('call process.exit() after a timeout', async (t) => {
  const clock = fakeTimers.install({ toFake: ['setTimeout'] })
  stubProcessExit()
  const stopLogging = logProcessErrors({ log() {}, exit: true })

  await EVENTS_MAP.uncaughtException.emit()
  t.deepEqual(process.exit.args, [])
  clock.tick(EXIT_TIMEOUT)
  t.deepEqual(process.exit.args, [[EXIT_CODE]])

  stopLogging()
  unStubProcessExit()
  clock.uninstall()
})

// eslint-disable-next-line max-statements
test.serial('wait for async log() before exiting', async (t) => {
  const clock = fakeTimers.install({ toFake: ['setTimeout'] })
  stubProcessExit()
  const logDuration = 1e5
  const stopLogging = logProcessErrors({
    async log() {
      await promisify(setTimeout)(logDuration)
    },
    exit: true,
  })

  await EVENTS_MAP.uncaughtException.emit()
  clock.tick(logDuration)
  await pNextTick()
  t.deepEqual(process.exit.args, [])
  clock.tick(EXIT_TIMEOUT)
  t.deepEqual(process.exit.args, [[EXIT_CODE]])

  stopLogging()
  unStubProcessExit()
  clock.uninstall()
})

test.serial('exit process if "exit: true"', async (t) => {
  stubProcessExit()
  const stopLogging = logProcessErrors({ log() {}, exit: true })

  await EVENTS_MAP.uncaughtException.emit()
  t.is(process.exitCode, EXIT_CODE)

  stopLogging()
  unStubProcessExit()
})

test.serial('does not exit process if "exit: false"', async (t) => {
  stubProcessExit()
  const stopLogging = logProcessErrors({ log() {}, exit: false })

  await EVENTS_MAP.uncaughtException.emit()
  t.is(process.exitCode, undefined)

  stopLogging()
  unStubProcessExit()
})

test.serial('does not exit process if not an exit event', async (t) => {
  stubProcessExit()
  const stopLogging = logProcessErrors({ log() {}, exit: true })

  await EVENTS_MAP.warning.emit()
  t.is(process.exitCode, undefined)

  stopLogging()
  unStubProcessExit()
})

test.serial(
  'does not exit process if unhandledRejection on Node 14',
  async (t) => {
    stubProcessExit()
    const stopLogging = logProcessErrors({ log() {}, exit: true })

    await EVENTS_MAP.unhandledRejection.emit()
    t.is(process.exit.exitCode === EXIT_CODE, version.startsWith('v14.'))

    stopLogging()
    unStubProcessExit()
  },
)

test.serial('exit process by default', async (t) => {
  stubProcessExit()
  const stopLogging = logProcessErrors({ log() {} })

  await EVENTS_MAP.uncaughtException.emit()
  t.is(process.exitCode, EXIT_CODE)

  stopLogging()
  unStubProcessExit()
})

const noop = function () {}

test.serial(
  'does not exit process by default if there are other listeners',
  async (t) => {
    stubProcessExit()
    const stopLogging = logProcessErrors({ log() {} })

    process.on('uncaughtException', noop)
    await EVENTS_MAP.uncaughtException.emit()
    t.is(process.exitCode, undefined)
    process.off('uncaughtException', noop)

    stopLogging()
    unStubProcessExit()
  },
)

test.serial(
  'exits process if there are other listeners but "exit: true"',
  async (t) => {
    stubProcessExit()
    const stopLogging = logProcessErrors({ log() {}, exit: true })

    process.on('uncaughtException', noop)
    await EVENTS_MAP.uncaughtException.emit()
    t.is(process.exitCode, EXIT_CODE)
    process.off('uncaughtException', noop)

    stopLogging()
    unStubProcessExit()
  },
)

test.serial(
  'exits process by default if there are other listeners for other events',
  async (t) => {
    stubProcessExit()
    const stopLogging = logProcessErrors({ log() {} })

    process.on('unhandledRejection', noop)
    await EVENTS_MAP.uncaughtException.emit()
    t.is(process.exitCode, EXIT_CODE)
    process.off('unhandledRejection', noop)

    stopLogging()
    unStubProcessExit()
  },
)

test.serial(
  'does not exit process by default if there are other listeners for other events but "exit: false"',
  async (t) => {
    stubProcessExit()
    const stopLogging = logProcessErrors({ log() {}, exit: false })

    process.on('unhandledRejection', noop)
    await EVENTS_MAP.uncaughtException.emit()
    t.is(process.exitCode, undefined)
    process.off('unhandledRejection', noop)

    stopLogging()
    unStubProcessExit()
  },
)
