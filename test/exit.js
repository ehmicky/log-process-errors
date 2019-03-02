'use strict'

const process = require('process')
const { promisify } = require('util')

const test = require('ava')
const sinon = require('sinon')
const lolex = require('lolex')

const pNextTick = promisify(process.nextTick)

// Required directly because this is exposed through documentation, but not
// through code
// eslint-disable-next-line import/no-internal-modules
const { EXIT_TIMEOUT, EXIT_STATUS } = require('../src/constants')

const { repeatEvents, startLogging } = require('./helpers')

// Stub `process.exit()`
const stubProcessExit = function() {
  const clock = lolex.install({ toFake: ['setTimeout'] })
  const processExit = sinon.stub(process, 'exit')
  return { clock, processExit }
}

const unstubProcessExit = function({ clock, processExit }) {
  processExit.restore()
  clock.uninstall()
}

const emitEventAndWait = async function(timeout, { clock, emitEvent }) {
  await emitEvent()
  clock.tick(timeout)
}

repeatEvents((prefix, { eventName, emitEvent }) => {
  test(`${prefix} should call process.exit(1) if inside opts.exitOn`, async t => {
    const { clock, processExit } = stubProcessExit()

    const exitOn = [eventName]
    const { stopLogging } = startLogging({ exitOn, eventName })

    await emitEventAndWait(EXIT_TIMEOUT, { clock, emitEvent })

    t.is(processExit.callCount, 1)
    t.is(processExit.firstCall.args[0], EXIT_STATUS)

    stopLogging()

    unstubProcessExit({ clock, processExit })
  })

  test(`${prefix} should not call process.exit(1) if not inside opts.exitOn`, async t => {
    const { clock, processExit } = stubProcessExit()

    const exitOn = []
    const { stopLogging } = startLogging({ exitOn, eventName })

    await emitEventAndWait(EXIT_TIMEOUT, { clock, emitEvent })

    t.true(processExit.notCalled)

    stopLogging()

    unstubProcessExit({ clock, processExit })
  })

  test(`${prefix} should delay process.exit(1)`, async t => {
    const { clock, processExit } = stubProcessExit()

    const { stopLogging } = startLogging({ exitOn: [eventName], eventName })

    await emitEventAndWait(EXIT_TIMEOUT - 1, { clock, emitEvent })

    t.true(processExit.notCalled)

    clock.tick(1)
    t.true(processExit.called)

    stopLogging()

    unstubProcessExit({ clock, processExit })
  })

  // eslint-disable-next-line ava/no-skip-test
  test.skip(`${prefix} should delay process.exit(1) with async opts.log()`, async t => {
    const { clock, processExit } = stubProcessExit()

    const { promise, resolve } = getPromise()

    const { stopLogging } = startLogging({
      exitOn: [eventName],
      eventName,
      // We use `async` keyword to make sure they are validated correctly
      // eslint-disable-next-line no-return-await
      log: async () => await promise,
    })

    await emitEventAndWait(EXIT_TIMEOUT, { clock, emitEvent })

    t.true(processExit.notCalled)

    await resolve()
    clock.tick(EXIT_TIMEOUT)

    t.true(processExit.called)

    stopLogging()

    unstubProcessExit({ clock, processExit })
  })
})

// Returns a promise that can be triggered from outside
const getPromise = function() {
  // eslint-disable-next-line fp/no-let, init-declarations
  let resolveA
  // eslint-disable-next-line promise/avoid-new
  const promise = new Promise(resolve => {
    // eslint-disable-next-line fp/no-mutation
    resolveA = getResolve.bind(null, resolve)
  })
  return { promise, resolve: resolveA }
}

const getResolve = async function(resolve) {
  resolve()
  await pNextTick()
}
