import test from 'ava'
import logProcessErrors from 'log-process-errors'
import sinon from 'sinon'
import { each } from 'test-each'

import { getConsoleStub } from './helpers/console.js'
import { EVENTS, emit } from './helpers/events.js'
import { removeProcessListeners } from './helpers/remove.js'

removeProcessListeners()

const consoleStub = getConsoleStub()

each(EVENTS, ({ title }, eventName) => {
  test.serial(`should fire opts.onError() | ${title}`, async (t) => {
    const onError = sinon.spy()
    const stopLogging = logProcessErrors({ onError, exit: false })

    t.false(onError.called)
    await emit(eventName)
    t.is(onError.callCount, eventName === 'rejectionHandled' ? 2 : 1)
    t.true(onError.args[onError.args.length - 1][0] instanceof Error)
    t.is(onError.args[onError.args.length - 1][1], eventName)

    stopLogging()
  })
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
