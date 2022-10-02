import { inspect } from 'util'

import test from 'ava'
import sinon from 'sinon'
import { each } from 'test-each'

import { EVENTS } from './helpers/events/main.js'
import { hasInlinePreview } from './helpers/events/version.js'
import { startLogging } from './helpers/init.js'
import { normalizeMessage } from './helpers/normalize.js'
import { removeProcessListeners } from './helpers/remove.js'

removeProcessListeners()

const snapshotArgs = function ([error, reason]) {
  return [
    normalizeMessage(inspect(error)),
    String(error),
    Object.keys(error),
    reason,
  ]
}

each(EVENTS, ({ title }, { eventName, emit }) => {
  test.serial(`should fire opts.log() | ${title}`, async (t) => {
    const { stopLogging, log } = startLogging({ spy: true })

    t.true(log.notCalled)

    await emit()

    t.true(log.called)

    stopLogging()
  })

  test.serial(`should fire opts.log() once | ${title}`, async (t) => {
    const { stopLogging, log } = startLogging({ spy: true, eventName })

    t.true(log.notCalled)

    await emit()

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
