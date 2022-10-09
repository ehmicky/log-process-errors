import { inspect } from 'util'

import test from 'ava'
import logProcessErrors from 'log-process-errors'
import sinon from 'sinon'
import { each } from 'test-each'

import { EVENTS } from './helpers/events.js'
import { startLogging } from './helpers/init.js'
import { normalizeMessage } from './helpers/normalize.js'
import { removeProcessListeners } from './helpers/remove.js'
import { hasInlinePreview } from './helpers/version.js'

removeProcessListeners()

const snapshotArgs = function ([error, event]) {
  return [
    normalizeMessage(inspect(error)),
    String(error),
    Object.keys(error),
    event,
  ]
}

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

    t.true(log.notCalled)

    await emit()

    t.true(log.called)
    t.is(log.callCount, 1)

    stopLogging()
  })

  if (hasInlinePreview()) {
    test.serial(
      `should fire opts.log() with arguments | ${title}`,
      async (t) => {
        const { stopLogging, log } = startLogging({ spy: true, eventName })

        await emit({ all: true })

        t.true(log.called)

        const snapshot = log.args.flatMap(snapshotArgs)
        t.snapshot(snapshot)

        stopLogging()
      },
    )
  }
})

each(EVENTS, ({ title }, { eventName, emit }) => {
  test.serial(`should log on the console by default | ${title}`, async (t) => {
    // eslint-disable-next-line no-restricted-globals
    const stub = sinon.stub(console, 'error')

    const { stopLogging } = startLogging({ log: 'default', eventName })

    await emit()

    t.is(stub.callCount, 1)

    stopLogging()

    stub.restore()
  })
})
