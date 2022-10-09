import test from 'ava'
import logProcessErrors from 'log-process-errors'
import sinon from 'sinon'
import { each } from 'test-each'

import { EVENTS } from './helpers/events.js'
import { removeProcessListeners } from './helpers/remove.js'

removeProcessListeners()

each(EVENTS, ({ title }, { eventName, emit }) => {
  test.serial(`should fire opts.log() | ${title}`, async (t) => {
    const log = sinon.spy()
    const stopLogging = logProcessErrors({
      log(error, event) {
        if (event === eventName) {
          log(error)
        }
      },
      exit: false,
    })

    t.false(log.called)
    await emit()
    t.true(log.called)
    t.is(log.callCount, 1)
    t.true(log.args[0][0] instanceof Error)

    stopLogging()
  })

  test.serial(`should log on the console by default | ${title}`, async (t) => {
    // eslint-disable-next-line no-restricted-globals
    const stub = sinon.stub(console, 'error')
    const stopLogging = logProcessErrors({ exit: false })

    t.false(stub.called)
    await emit()
    t.is(stub.callCount, eventName === 'rejectionHandled' ? 2 : 1)
    t.true(stub.args[stub.args.length - 1][0] instanceof Error)

    stopLogging()
    stub.restore()
  })
})
