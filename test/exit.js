'use strict'

const process = require('process')

const sinon = require('sinon')
const lolex = require('lolex')

// eslint-disable-next-line import/no-internal-modules
const { EXIT_TIMEOUT } = require('../src/exit')

const { forEachEvent, startLogging } = require('./helpers')

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

/* eslint-disable max-nested-callbacks */
forEachEvent(({ eventName, emitEvent, test }) => {
  test('should call process.exit(1) if inside opts.exitOn', async t => {
    const { clock, processExit } = stubProcessExit()

    const exitOn = [eventName]
    const { stopLogging } = startLogging({ exitOn, eventName })

    await emitEventAndWait(EXIT_TIMEOUT, { clock, emitEvent })

    t.is(processExit.callCount, 1)
    t.is(processExit.firstCall.args[0], 1)

    stopLogging()

    unstubProcessExit({ clock, processExit })
  })

  test('should not call process.exit(1) if not inside opts.exitOn', async t => {
    const { clock, processExit } = stubProcessExit()

    const exitOn = []
    const { stopLogging } = startLogging({ exitOn, eventName })

    await emitEventAndWait(EXIT_TIMEOUT, { clock, emitEvent })

    t.true(processExit.notCalled)

    stopLogging()

    unstubProcessExit({ clock, processExit })
  })

  test('should delay process.exit(1)', async t => {
    const { clock, processExit } = stubProcessExit()

    const { stopLogging } = startLogging({ exitOn: [eventName], eventName })

    await emitEventAndWait(EXIT_TIMEOUT - 1, { clock, emitEvent })

    t.true(processExit.notCalled)

    clock.tick(1)
    t.true(processExit.called)

    stopLogging()

    unstubProcessExit({ clock, processExit })
  })
})
/* eslint-enable max-nested-callbacks */
