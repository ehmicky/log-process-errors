import process from 'process'

import test from 'ava'
import testEach from 'test-each'
import sinon from 'sinon'

import { EVENT_DATA } from '../helpers/events/main.js'
import { startLogging, startLoggingNoOpts } from '../helpers/init.js'
import { removeProcessListeners } from '../helpers/remove.js'

removeProcessListeners()

const addProcessHandler = function(eventName) {
  const processHandler = sinon.spy()
  process.on(eventName, processHandler)
  return processHandler
}

const normalizeArgs = function([error]) {
  return String(error)
}

testEach(EVENT_DATA, ({ name }, { eventName, emitEvent, defaultLevel }) => {
  test.serial(`should work with no options | ${name}`, async t => {
    // eslint-disable-next-line no-restricted-globals
    const stub = sinon.stub(console, defaultLevel)
    const { stopLogging } = startLoggingNoOpts()

    await emitEvent()

    const messages = stub.args.map(normalizeArgs)

    stopLogging()
    stub.restore()

    t.snapshot(messages)
  })

  test.serial(
    `should keep existing process event handlers | ${name}`,
    async t => {
      if (eventName === 'warning') {
        return t.pass()
      }

      const processHandler = addProcessHandler(eventName)

      const { stopLogging } = startLogging()

      t.true(processHandler.notCalled)

      await emitEvent()

      t.true(processHandler.called)

      stopLogging()

      // TODO: use `process.off()` instead of `process.removeListener()`
      // after dropping Node.js <10 support
      process.removeListener(eventName, processHandler)
    },
  )

  test.serial(`should allow disabling logging | ${name}`, async t => {
    const processHandler = addProcessHandler(eventName)

    const { stopLogging, log } = startLogging({ log: 'spy' })

    stopLogging()

    t.true(processHandler.notCalled)

    await emitEvent()

    t.true(processHandler.called)
    t.true(log.notCalled)

    stopLogging()

    // TODO: use `process.off()` instead of `process.removeListener()`
    // after dropping Node.js <10 support
    process.removeListener(eventName, processHandler)
  })
})
