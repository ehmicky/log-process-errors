'use strict'

const { inspect } = require('util')

const test = require('ava')
const hasAnsi = require('has-ansi')
const supportsColor = require('supports-color')

const { repeatEvents, startLogging } = require('./helpers')

repeatEvents((prefix, { name, emitEvent }) => {
  test(`${prefix} should colorize the error`, async t => {
    const { stopLogging, log } = startLogging({ log: 'spy', name })

    await emitEvent()

    t.true(log.calledOnce)
    t.false(hasAnsi(String(log.firstCall.args[0])))
    t.false(hasAnsi(log.firstCall.args[0].stack))
    t.is(hasAnsi(inspect(log.firstCall.args[0])), Boolean(supportsColor.stdout))

    stopLogging()
  })

  test(`${prefix} should allow disabling colorizing the error`, async t => {
    const { stopLogging, log } = startLogging({
      log: 'spy',
      colors: false,
      name,
    })

    await emitEvent()

    t.true(log.calledOnce)
    t.false(hasAnsi(inspect(log.firstCall.args[0])))

    stopLogging()
  })
})
