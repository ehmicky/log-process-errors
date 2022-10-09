import test from 'ava'
import logProcessErrors from 'log-process-errors'
import sinon from 'sinon'
import { each } from 'test-each'

import { getConsoleStub } from './helpers/console.js'
import { EVENTS, emit, getCallCount } from './helpers/events.js'
import { removeProcessListeners } from './helpers/remove.js'

removeProcessListeners()
const consoleStub = getConsoleStub()

each(EVENTS, ({ title }, eventName) => {
  test.serial(`should fire opts.onError() | ${title}`, async (t) => {
    const onError = sinon.spy()
    const stopLogging = logProcessErrors({ onError, exit: false })

    t.false(onError.called)
    await emit(eventName)
    t.is(onError.callCount, getCallCount(eventName))
    const [error, event] = onError.args[onError.args.length - 1]
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
      const stopLogging = logProcessErrors({
        onError(...args) {
          onError(...args)
          throw testError
        },
        exit: false,
      })

      await emit(eventName)
      const [, [error, event]] = onError.args
      t.is(error, testError)
      t.is(event, 'unhandledRejection')

      stopLogging()
    },
  )
})

test.serial('should log on the console by default', async (t) => {
  const stopLogging = logProcessErrors()

  t.false(consoleStub.called)
  await emit('warning')
  t.is(consoleStub.callCount, 1)
  t.true(consoleStub.args[consoleStub.args.length - 1][0] instanceof Error)

  stopLogging()
  consoleStub.reset()
})
