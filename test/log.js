import { version } from 'process'
import { inspect } from 'util'

import test from 'ava'
import semver from 'semver'
import sinon from 'sinon'
import { each } from 'test-each'

import { EVENTS } from './helpers/events/main.js'
import { startLogging } from './helpers/init.js'
import { LEVELS } from './helpers/level.js'
import { normalizeMessage } from './helpers/normalize.js'
// eslint-disable-next-line import/max-dependencies
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

// Stack traces change with this Node.js version
const MIN_STACK_VERSION = '14.0.0'

each([EVENTS[0]], ({ title }, { eventName, emit }) => {
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

  if (semver.gte(version, MIN_STACK_VERSION)) {
    test.serial(
      `should fire opts.log() with arguments | ${title}`,
      async (t) => {
        const { stopLogging, log } = startLogging({ log: 'spy', eventName })

        await emit({ all: true })

        t.true(log.called)

        const snapshot = log.args.flatMap(snapshotArgs)
        t.snapshot(snapshot)

        stopLogging()
      },
    )
  }
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
