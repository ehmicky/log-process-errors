import { inspect } from 'util'

import sinon from 'sinon'
import test from 'ava'

import { repeat } from './helpers/data_driven/main.js'
import { EVENT_DATA, NORMAL_LEVELS } from './helpers/repeat.js'
import { startLogging } from './helpers/init.js'
import { stubStackTrace, unstubStackTrace } from './helpers/stack.js'
import { normalizeMessage } from './helpers/normalize.js'
import { removeProcessListeners } from './helpers/remove.js'

removeProcessListeners()

const snapshotArgs = function([error, level]) {
  return [
    normalizeMessage(inspect(error), { colors: false }),
    String(error.stack),
    String(error),
    level,
  ]
}

repeat(EVENT_DATA, ({ name }, { eventName, emitEvent }) => {
  test.serial(`${name} should fire opts.log()`, async t => {
    const { stopLogging, log } = startLogging({ log: 'spy' })

    t.true(log.notCalled)

    await emitEvent()

    t.true(log.called)

    stopLogging()
  })

  test.serial(`${name} should fire opts.log() once`, async t => {
    const { stopLogging, log } = startLogging({ log: 'spy', eventName })

    t.true(log.notCalled)

    await emitEvent()

    t.is(log.callCount, 1)

    stopLogging()
  })

  test.serial(`${name} should fire opts.log() with arguments`, async t => {
    stubStackTrace()

    const { stopLogging, log } = startLogging({ log: 'spy', eventName })

    await emitEvent({ all: true })

    t.true(log.called)

    const snapshot = log.args.flatMap(snapshotArgs)
    t.snapshot(snapshot)

    stopLogging()

    unstubStackTrace()
  })
})

repeat(
  EVENT_DATA,
  NORMAL_LEVELS,
  ({ name }, { eventName, emitEvent }, level) => {
    test.serial(`${name} should log on the console by default`, async t => {
      // eslint-disable-next-line no-restricted-globals
      const stub = sinon.stub(console, level)

      const { stopLogging } = startLogging({
        log: 'default',
        level: { default: level },
        eventName,
      })

      await emitEvent()

      t.is(stub.callCount, 1)

      stopLogging()

      stub.restore()
    })
  },
)
