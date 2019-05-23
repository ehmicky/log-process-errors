import { inspect } from 'util'

import test from 'ava'
import hasAnsi from 'has-ansi'
import supportsColor from 'supports-color'

import { repeatEvents } from './helpers/repeat.js'
import { startLogging } from './helpers/init.js'
import { removeProcessListeners } from './helpers/remove.js'

removeProcessListeners()

repeatEvents((prefix, { eventName, emitEvent }) => {
  test.serial(`${prefix} should colorize the error`, async t => {
    const { stopLogging, log } = startLogging({ log: 'spy', eventName })

    await emitEvent()

    t.true(log.calledOnce)
    t.false(hasAnsi(String(log.firstCall.args[0])))
    t.false(hasAnsi(log.firstCall.args[0].stack))
    t.is(hasAnsi(inspect(log.firstCall.args[0])), Boolean(supportsColor.stdout))

    stopLogging()
  })

  test.serial(
    `${prefix} should allow disabling colorizing the error`,
    async t => {
      const { stopLogging, log } = startLogging({
        log: 'spy',
        colors: false,
        eventName,
      })

      await emitEvent()

      t.true(log.calledOnce)
      t.false(hasAnsi(inspect(log.firstCall.args[0])))

      stopLogging()
    },
  )
})
