import { inspect } from 'util'

import test from 'ava'
import testEach from 'test-each'
import hasAnsi from 'has-ansi'
import supportsColor from 'supports-color'

import { EVENTS } from './helpers/events/main.js'
import { startLogging } from './helpers/init.js'
import { removeProcessListeners } from './helpers/remove.js'

removeProcessListeners()

testEach(EVENTS, ({ title }, { eventName, emit }) => {
  test.serial(`should colorize the error | ${title}`, async t => {
    const { stopLogging, log } = startLogging({ log: 'spy', eventName })

    await emit()

    t.true(log.calledOnce)
    t.false(hasAnsi(String(log.firstCall.args[0])))
    t.false(hasAnsi(log.firstCall.args[0].stack))
    t.is(hasAnsi(inspect(log.firstCall.args[0])), Boolean(supportsColor.stdout))

    stopLogging()
  })

  test.serial(
    `should allow disabling colorizing the error | ${title}`,
    async t => {
      const { stopLogging, log } = startLogging({
        log: 'spy',
        colors: false,
        eventName,
      })

      await emit()

      t.true(log.calledOnce)
      t.false(hasAnsi(inspect(log.firstCall.args[0])))

      stopLogging()
    },
  )
})
