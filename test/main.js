/* eslint-disable max-lines */
'use strict'

const process = require('process')

const test = require('ava')
const sinon = require('sinon')
const hasAnsi = require('has-ansi')
const supportsColor = require('supports-color')
const chalk = require('chalk')
const lolex = require('lolex')

const logProcessErrors = require('../src')
// eslint-disable-next-line import/no-internal-modules
const { LEVELS } = require('../src/level')
// eslint-disable-next-line import/no-internal-modules
const { EXIT_TIMEOUT } = require('../src/exit')
// eslint-disable-next-line import/no-internal-modules
const { MAX_EVENTS } = require('../src/limit')
const EVENTS = require('../helpers')

// Ava sets up process `uncaughtException` and `unhandledRejection` handlers
// which makes testing them harder.
const removeProcessListeners = function() {
  Object.keys(EVENTS).forEach(eventName =>
    process.removeAllListeners(eventName),
  )
}

removeProcessListeners()

const startLogging = function({
  eventName,
  skipEvent,
  log,
  level,
  message,
  ...opts
} = {}) {
  const logA = getLog({ log })
  const getLevel = getLevelFunc({ level })
  const getMessage = getMessageFunc({ message })
  const skipEventA = getSkipEvent({ eventName, skipEvent })
  const stopLogging = logProcessErrors({
    log: logA,
    getLevel,
    getMessage,
    skipEvent: skipEventA,
    exitOn: [],
    ...opts,
  })
  return { stopLogging, log: logA, getLevel, getMessage }
}

const getLog = function({ log }) {
  if (log === 'default') {
    return
  }

  if (log === 'spy') {
    return sinon.spy()
  }

  if (log === undefined) {
    return noop
  }

  return log
}

// eslint-disable-next-line no-empty-function
const noop = function() {}

const getLevelFunc = function({ level }) {
  if (level === undefined) {
    return
  }

  return sinon.spy(() => level)
}

const getMessageFunc = function({ message }) {
  if (message === undefined) {
    return
  }

  return sinon.spy(() => message)
}

const getSkipEvent = function({ eventName, skipEvent }) {
  if (eventName === undefined) {
    return skipEvent
  }

  return onlyEvent.bind(null, eventName)
}

const onlyEvent = function(eventName, info) {
  return info.eventName !== eventName
}

const addProcessHandler = function(eventName) {
  const processHandler = sinon.spy()
  process.on(eventName, processHandler)
  return processHandler
}

// We need to patch `Error.stack` since it's host-dependent
const stubStackTrace = function() {
  // eslint-disable-next-line fp/no-mutation
  Error.prepareStackTrace = prepareStackTrace
}

const prepareStackTrace = function({ message }) {
  return `Error: ${message}\n    at STACK TRACE`
}

// Make `Error.stack` random for testing
const stubStackTraceRandom = function() {
  // eslint-disable-next-line fp/no-mutation
  Error.prepareStackTrace = prepareStackTraceRandom
}

const prepareStackTraceRandom = function({ message }) {
  return `Error: ${message}\n    at ${Math.random()}`
}

const unstubStackTrace = function() {
  // eslint-disable-next-line fp/no-mutation
  Error.prepareStackTrace = originalPrepare
}

const originalPrepare = Error.prepareStackTrace

const isLimitedWarning = function({ eventName, error: { name } = {} }) {
  return eventName === 'warning' && name === 'LogProcessError'
}

const emitEvents = async function(maxEvents, emitEvent) {
  // eslint-disable-next-line fp/no-let, fp/no-mutation, fp/no-loops
  for (let count = 0; count <= maxEvents; count += 1) {
    // eslint-disable-next-line no-await-in-loop
    await emitEvent()
  }
}

test('should validate opts.log() is a function', t => {
  t.throws(startLogging.bind(null, { log: true }))
})

test('should validate opts.skipEvent() is a function', t => {
  t.throws(startLogging.bind(null, { skipEvent: true }))
})

test('should validate opts.getLevel() is a function', t => {
  t.throws(startLogging.bind(null, { getLevel: true }))
})

test('should validate opts.getMessage() is a function', t => {
  t.throws(startLogging.bind(null, { getMessage: true }))
})

test('should validate opts.colors is a boolean', t => {
  t.throws(startLogging.bind(null, { colors: 1 }))
})

test('should validate opts.exitOn is an array', t => {
  t.throws(startLogging.bind(null, { exitOn: true }))
})

test('[uncaughtException] should set info properties', async t => {
  const { stopLogging, log } = startLogging({
    log: 'spy',
    eventName: 'uncaughtException',
  })

  const getError = () => true
  await EVENTS.uncaughtException(getError)

  t.is(log.callCount, 1)

  t.deepEqual(log.firstCall.args[2], {
    eventName: 'uncaughtException',
    error: true,
  })

  stopLogging()
})

test('[warning] should set info properties', async t => {
  const { stopLogging, log } = startLogging({
    log: 'spy',
    eventName: 'warning',
  })

  const warning = { message: 'message', code: '500', detail: 'Detail' }
  await EVENTS.warning(warning)

  t.is(log.callCount, 1)

  const {
    firstCall: {
      args: [, , info],
    },
  } = log
  t.deepEqual(
    { ...info, error: { ...info.error, message: info.error.message } },
    { eventName: 'warning', error: { ...warning, name: 'Warning' } },
  )
  t.true(info.error instanceof Error)

  stopLogging()
})

test('[unhandledRejection] should set info properties', async t => {
  const { stopLogging, log } = startLogging({
    log: 'spy',
    eventName: 'unhandledRejection',
  })

  const getError = () => true
  await EVENTS.unhandledRejection(getError)

  t.is(log.callCount, 1)

  t.deepEqual(log.firstCall.args[2], {
    eventName: 'unhandledRejection',
    promiseState: 'rejected',
    promiseValue: true,
  })

  stopLogging()
})

test('[rejectionHandled] should set info properties', async t => {
  const { stopLogging, log } = startLogging({
    log: 'spy',
    eventName: 'rejectionHandled',
  })

  const getError = () => true
  await EVENTS.rejectionHandled(getError)

  t.is(log.callCount, 1)

  t.deepEqual(log.firstCall.args[2], {
    eventName: 'rejectionHandled',
    promiseState: 'rejected',
    promiseValue: true,
  })

  stopLogging()
})

test('[multipleResolves] should set info properties', async t => {
  const { stopLogging, log } = startLogging({
    log: 'spy',
    eventName: 'multipleResolves',
  })

  await EVENTS.multipleResolves([
    ['resolve', () => true],
    ['reject', () => false],
  ])

  t.is(log.callCount, 1)

  t.deepEqual(log.firstCall.args[2], {
    eventName: 'multipleResolves',
    promiseState: 'resolved',
    promiseValue: true,
    secondPromiseState: 'rejected',
    secondPromiseValue: false,
  })

  stopLogging()
})

test('[multipleResolves] should get the right promise order', async t => {
  const { stopLogging, log } = startLogging({
    log: 'spy',
    eventName: 'multipleResolves',
  })

  await EVENTS.multipleResolves([
    ['reject', () => false],
    ['resolve', () => true],
  ])

  t.is(log.callCount, 1)

  t.deepEqual(log.firstCall.args[2], {
    eventName: 'multipleResolves',
    promiseState: 'rejected',
    promiseValue: false,
    secondPromiseState: 'resolved',
    secondPromiseValue: true,
  })

  stopLogging()
})

/* eslint-disable max-nested-callbacks */
Object.entries(EVENTS)
  .filter(([eventName]) => eventName !== 'all')
  // eslint-disable-next-line max-lines-per-function, max-statements
  .forEach(([eventName, emitEvent]) => {
    test(`[${eventName}] events emitters should exist`, t => {
      t.is(typeof emitEvent, 'function')
    })

    test(`[${eventName}] events emitters should not throw`, async t => {
      const { stopLogging } = startLogging()

      await t.notThrowsAsync(emitEvent)

      stopLogging()
    })

    test(`[${eventName}] should keep existing process event handlers`, async t => {
      const processHandler = addProcessHandler(eventName)

      const { stopLogging } = startLogging()

      t.true(processHandler.notCalled)

      await emitEvent()

      t.true(processHandler.called)

      stopLogging()

      process.off(eventName, processHandler)
    })

    test(`[${eventName}] should allow disabling logging`, async t => {
      const processHandler = addProcessHandler(eventName)

      const { stopLogging, log } = startLogging({ log: 'spy' })

      stopLogging()

      t.true(processHandler.notCalled)

      await emitEvent()

      t.true(processHandler.called)
      t.true(log.notCalled)

      process.off(eventName, processHandler)
    })

    test(`[${eventName}] should disable logging idempotently`, async t => {
      const processHandler = addProcessHandler(eventName)

      const { stopLogging, log } = startLogging({ log: 'spy' })

      stopLogging()
      stopLogging()

      t.true(processHandler.notCalled)

      await emitEvent()

      t.true(processHandler.called)
      t.true(log.notCalled)

      process.off(eventName, processHandler)
    })

    test(`[${eventName}] should fire opts.log()`, async t => {
      const { stopLogging, log } = startLogging({ log: 'spy' })

      t.true(log.notCalled)

      await emitEvent()

      t.true(log.called)

      stopLogging()
    })

    test(`[${eventName}] should fire opts.log() once`, async t => {
      const { stopLogging, log } = startLogging({ log: 'spy', eventName })

      t.true(log.notCalled)

      await emitEvent()

      t.is(log.callCount, 1)

      stopLogging()
    })

    test(`[${eventName}] should fire opts.log() with message`, async t => {
      const { stopLogging, log } = startLogging({
        log: 'spy',
        message: 'message',
        eventName,
      })

      await emitEvent()

      t.is(log.callCount, 1)
      t.is(log.firstCall.args[0], 'message')

      stopLogging()
    })

    test(`[${eventName}] should fire opts.log() with info`, async t => {
      const { stopLogging, log } = startLogging({ log: 'spy', eventName })

      await emitEvent()

      t.is(log.callCount, 1)
      t.is(typeof log.firstCall.args[2], 'object')

      stopLogging()
    })

    test(`[${eventName}] should allow skipping events`, async t => {
      const skipEvent = sinon.spy(() => true)
      const { stopLogging, log } = startLogging({ log: 'spy', skipEvent })

      await emitEvent()

      t.true(skipEvent.called)
      t.true(log.notCalled)

      stopLogging()
    })

    test(`[${eventName}] should fire opts.skipEvent() with info`, async t => {
      const skipEvent = sinon.spy(() => true)
      const { stopLogging } = startLogging({ skipEvent })

      await emitEvent()

      t.is(typeof skipEvent.firstCall.args[0], 'object')

      stopLogging()
    })

    test(`[${eventName}] should use default opts.getLevel()`, async t => {
      const { stopLogging, log } = startLogging({ log: 'spy', eventName })

      await emitEvent()

      t.is(log.callCount, 1)
      const level = eventName === 'warning' ? 'warn' : 'error'
      t.deepEqual(log.firstCall.args[1], level)

      stopLogging()
    })

    test(`[${eventName}] should use default opts.getLevel() when returning a valid level`, async t => {
      const { stopLogging, log, getLevel } = startLogging({
        log: 'spy',
        level: 'invalid',
        eventName,
      })

      await emitEvent()

      t.true(getLevel.called)
      t.true(log.called)
      const level = eventName === 'warning' ? 'warn' : 'error'
      t.deepEqual(log.firstCall.args[1], level)

      stopLogging()
    })

    test(`[${eventName}] should emit a warning when opts.getLevel() when returns a valid level`, async t => {
      const { stopLogging, getLevel } = startLogging({
        level: 'invalid',
        eventName,
      })

      const { stopLogging: stopWarningLog, log } = startLogging({
        log: 'spy',
        eventName: 'warning',
      })

      await emitEvent()

      t.true(getLevel.called)
      t.true(log.called)

      stopWarningLog()
      stopLogging()
    })

    test(`[${eventName}] should allow customizing log message`, async t => {
      const { stopLogging, log, getMessage } = startLogging({
        log: 'spy',
        message: 'message',
        eventName,
      })

      await emitEvent()

      t.true(getMessage.calledOnce)
      t.true(log.calledOnce)
      t.is(log.firstCall.args[0], 'message')

      stopLogging()
    })

    test(`[${eventName}] should stringify opts.getMessage() return value`, async t => {
      const { stopLogging, log } = startLogging({
        log: 'spy',
        message: true,
        eventName,
      })

      await emitEvent()

      t.true(log.calledOnce)
      t.is(log.firstCall.args[0], 'true')

      stopLogging()
    })

    test(`[${eventName}] should colorize default opts.getMessage()`, async t => {
      const { stopLogging, log } = startLogging({ log: 'spy', eventName })

      await emitEvent()

      t.true(log.calledOnce)
      t.is(hasAnsi(log.firstCall.args[0]), Boolean(supportsColor.stdout))

      stopLogging()
    })

    test(`[${eventName}] should allow forcing colorizing default opts.getMessage()`, async t => {
      const { stopLogging, log } = startLogging({
        log: 'spy',
        colors: true,
        eventName,
      })

      await emitEvent()

      t.true(log.calledOnce)
      t.true(hasAnsi(log.firstCall.args[0]))

      stopLogging()
    })

    test(`[${eventName}] should allow disabling colorizing default opts.getMessage()`, async t => {
      const { stopLogging, log } = startLogging({
        log: 'spy',
        colors: false,
        eventName,
      })

      await emitEvent()

      t.true(log.calledOnce)
      t.false(hasAnsi(log.firstCall.args[0]))

      stopLogging()
    })

    test(`[${eventName}] should call process.exit(1) if inside opts.exitOn`, async t => {
      const clock = lolex.install({ toFake: ['setTimeout'] })

      const stub = sinon.stub(process, 'exit')

      const { stopLogging } = startLogging({ exitOn: [eventName], eventName })

      await emitEvent()

      clock.tick(EXIT_TIMEOUT)

      t.is(stub.callCount, 1)
      t.is(stub.firstCall.args[0], 1)

      stopLogging()

      stub.restore()

      clock.uninstall()
    })

    test(`[${eventName}] should not call process.exit(1) if not inside opts.exitOn`, async t => {
      const clock = lolex.install({ toFake: ['setTimeout'] })

      const stub = sinon.stub(process, 'exit')

      const { stopLogging } = startLogging({ exitOn: [], eventName })

      await emitEvent()

      clock.tick(EXIT_TIMEOUT)

      t.true(stub.notCalled)

      stopLogging()

      stub.restore()

      clock.uninstall()
    })

    // eslint-disable-next-line max-statements
    test(`[${eventName}] should delay process.exit(1)`, async t => {
      const clock = lolex.install({ toFake: ['setTimeout'] })

      const stub = sinon.stub(process, 'exit')

      const { stopLogging } = startLogging({ exitOn: [eventName], eventName })

      await emitEvent()

      clock.tick(EXIT_TIMEOUT - 1)
      t.true(stub.notCalled)

      clock.tick(1)
      t.true(stub.called)

      stopLogging()

      stub.restore()

      clock.uninstall()
    })

    test(`[${eventName}] should not repeat identical events`, async t => {
      stubStackTrace()

      const { stopLogging, log } = startLogging({ log: 'spy', eventName })

      await emitEvents(2, emitEvent)

      t.is(log.callCount, 1)

      stopLogging()

      unstubStackTrace()
    })

    test(`[${eventName}] should limit events`, async t => {
      stubStackTraceRandom()

      const skipEvent = info =>
        info.eventName !== eventName || isLimitedWarning(info)
      const { stopLogging, log } = startLogging({ log: 'spy', skipEvent })

      await emitEvents(MAX_EVENTS - 1, emitEvent)

      t.is(log.callCount, MAX_EVENTS)

      await emitEvent()

      t.is(log.callCount, MAX_EVENTS)

      stopLogging()

      unstubStackTrace()
    })

    test(`[${eventName}] should emit warning when limiting events`, async t => {
      stubStackTraceRandom()

      const skipEvent = info => !isLimitedWarning(info)
      const { stopLogging, log } = startLogging({ log: 'spy', skipEvent })

      await emitEvents(MAX_EVENTS - 1, emitEvent)

      t.true(log.notCalled)

      await emitEvent()

      t.true(log.called)

      stopLogging()

      unstubStackTrace()
    })

    test(`[${eventName}] should only emit warning once when limiting events`, async t => {
      stubStackTraceRandom()

      const skipEvent = info => !isLimitedWarning(info)
      const { stopLogging, log } = startLogging({ log: 'spy', skipEvent })

      await emitEvents(MAX_EVENTS, emitEvent)

      const { callCount } = log

      await emitEvent()

      t.is(log.callCount, callCount)

      stopLogging()

      unstubStackTrace()
    })

    // eslint-disable-next-line max-lines-per-function
    Object.keys(LEVELS).forEach(level => {
      test(`[${eventName}] [${level}] should fire opts.log() with event`, async t => {
        const { stopLogging, log } = startLogging({
          log: 'spy',
          level,
          eventName,
        })

        await emitEvent()

        t.is(log.callCount, 1)
        t.is(log.firstCall.args[1], level)

        stopLogging()
      })

      test(`[${eventName}] [${level}] should log on the console by default`, async t => {
        // eslint-disable-next-line no-restricted-globals
        const stub = sinon.stub(console, level)

        const { stopLogging } = startLogging({
          log: 'default',
          message: 'message',
          level,
          eventName,
        })

        await emitEvent()

        t.is(stub.callCount, 1)
        t.is(stub.firstCall.args[0], 'message')

        stopLogging()

        stub.restore()
      })

      test(`[${eventName}] [${level}] should allow changing log level`, async t => {
        const { stopLogging, log, getLevel } = startLogging({
          log: 'spy',
          level,
          eventName,
        })

        await emitEvent()

        t.is(getLevel.callCount, 1)
        t.is(log.callCount, 1)
        t.is(log.firstCall.args[1], level)

        stopLogging()
      })

      test(`[${eventName}] [${level}] should fire opts.getLevel() with info`, async t => {
        const { stopLogging, getLevel } = startLogging({ level, eventName })

        await emitEvent()

        t.true(getLevel.called)
        t.is(typeof getLevel.firstCall.args[0], 'object')

        stopLogging()
      })

      test(`[${eventName}] [${level}] should fire opts.getMessage() with info`, async t => {
        const { stopLogging, getMessage } = startLogging({
          message: 'message',
          level,
          eventName,
        })

        await emitEvent()

        t.true(getMessage.calledOnce)
        t.is(typeof getMessage.firstCall.args[0], 'object')
        t.is(getMessage.firstCall.args[0].level, level)
        t.true(getMessage.firstCall.args[0].colors instanceof chalk.constructor)

        stopLogging()
      })

      test(`[${eventName}] [${level}] should fire opts.getMessage() with a default prettifier`, async t => {
        stubStackTrace()

        const { stopLogging, log } = startLogging({
          log: 'spy',
          level,
          colors: false,
          eventName,
        })

        await emitEvent()

        t.true(log.calledOnce)
        t.snapshot(log.lastCall.args[0])

        stopLogging()

        unstubStackTrace()
      })
    })
  })
/* eslint-enable max-nested-callbacks */

/* eslint-enable max-lines */
