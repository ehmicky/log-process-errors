import { stdout } from 'process'
import { inspect } from 'util'

import test from 'ava'
import hasAnsi from 'has-ansi'
import { each } from 'test-each'

import { EVENTS } from './helpers/events/main.js'
import { startLogging } from './helpers/init.js'
import { removeProcessListeners } from './helpers/remove.js'

removeProcessListeners()

each(EVENTS, ({ title }, { eventName, emit }) => {
  test.serial(`should colorize the error | ${title}`, async (t) => {
    const { stopLogging, log } = startLogging({ log: 'spy', eventName })

    await emit()

    t.true(log.calledOnce)
    t.false(hasAnsi(String(log.firstCall.args[0])))
    t.false(hasAnsi(log.firstCall.args[0].stack))
    t.is(
      hasAnsi(inspect(log.firstCall.args[0])),
      Boolean(stdout.isTTY) && stdout.hasColors(),
    )

    stopLogging()
  })
})

each(EVENTS, [true, false], ({ title }, { eventName, emit }, colors) => {
  test.serial(
    `should allow enabling/disabling colorizing the error | ${title}`,
    async (t) => {
      const { stopLogging, log } = startLogging({
        log: 'spy',
        colors,
        eventName,
      })

      await emit()

      t.true(log.calledOnce)
      t.is(hasAnsi(inspect(log.firstCall.args[0])), colors)

      stopLogging()
    },
  )
})
