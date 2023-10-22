import test from 'ava'
import sinon from 'sinon'
import { each } from 'test-each'

import { getConsoleStub } from './helpers/console.test.js'
import { EVENTS, emit, getCallCount } from './helpers/events.test.js'
import { removeProcessListeners } from './helpers/remove.test.js'
import { startLogging } from './helpers/start.test.js'

const consoleStub = getConsoleStub()

each(EVENTS, ({ title }, eventName) => {
  test.serial(`should fire opts.onError() | ${title}`, async (t) => {
    const { onError, stopLogging } = startLogging()

    t.false(onError.called)
    await emit(eventName)
    t.is(onError.callCount, getCallCount(eventName))
    const [error, event] = onError.args.at(-1)
    t.true(error instanceof Error)
    t.is(event, eventName)

    stopLogging()
  })

  test.serial(
    `should handle errors in opts.onError() | ${title}`,
    async (t) => {
      // Ava modifies how uncaught exceptions are handled there
      if (eventName === 'uncaughtException') {
        return t.pass()
      }

      const onError = sinon.spy()
      const testError = new Error('test')
      const { stopLogging } = startLogging({
        onError: (...args) => {
          onError(...args)
          throw testError
        },
      })

      await emit(eventName)
      const [, [error, event]] = onError.args
      t.is(error, testError)
      t.is(event, 'unhandledRejection')

      stopLogging()
    },
  )

  test.serial(`should log on the console by default | ${title}`, async (t) => {
    const { stopLogging } = startLogging({ onError: undefined })

    t.false(consoleStub.called)
    await emit(eventName)
    t.is(consoleStub.callCount, getCallCount(eventName))
    t.true(consoleStub.args.at(-1)[0] instanceof Error)

    stopLogging()
    consoleStub.reset()
  })
})

removeProcessListeners()
