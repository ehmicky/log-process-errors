import { inspect } from 'util'

import test from 'ava'
import sinon from 'sinon'
import { each } from 'test-each'

import { EVENTS } from './helpers/events/main.js'
import { startLogging } from './helpers/init.js'
import { LEVELS } from './helpers/level.js'
import { normalizeMessage } from './helpers/normalize.js'
import { removeProcessListeners } from './helpers/remove.js'

removeProcessListeners()

const snapshotArgs = function ([error, level, mainValue]) {
  return [
    normalizeMessage(inspect(error), { colors: false }),
    String(error),
    Object.keys(error),
    level,
    mainValue,
  ]
}

each(EVENTS, ({ title }, { eventName, emit }) => {
  test.serial(`should fire opts.log() | ${title}`, async (t) => {
    const { stopLogging, log } = startLogging({ log: 'spy' })

    t.true(log.notCalled)

    await emit()

    t.true(log.called)

    stopLogging()
  })

  test.serial(`should fire opts.log() once | ${title}`, async (t) => {
    const { stopLogging, log } = startLogging({ log: 'spy', eventName })

    t.true(log.notCalled)

    await emit()

    t.is(log.callCount, 1)

    stopLogging()
  })

  test.serial(`should fire opts.log() with arguments | ${title}`, async (t) => {
    const { stopLogging, log } = startLogging({ log: 'spy', eventName })

    await emit({ all: true })

    t.true(log.called)

    const snapshot = [].concat(...log.args.map(snapshotArgs))
    t.snapshot(snapshot)

    stopLogging()
  })
})

each(EVENTS, LEVELS, ({ title }, { eventName, emit }, level) => {
  test.serial(`should log on the console by default | ${title}`, async (t) => {
    // eslint-disable-next-line no-restricted-globals
    const stub = sinon.stub(console, level)

    const { stopLogging } = startLogging({
      log: 'default',
      level: { default: level },
      eventName,
    })

    await emit()

    t.is(stub.callCount, 1)

    stopLogging()

    stub.restore()
  })
})
