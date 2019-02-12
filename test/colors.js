'use strict'

const test = require('ava')
const hasAnsi = require('has-ansi')
const supportsColor = require('supports-color')

const { repeatEvents, startLogging } = require('./helpers')

/* eslint-disable max-nested-callbacks */
repeatEvents((prefix, { eventName, emitEvent }) => {
  test(`${prefix} should colorize default opts.message()`, async t => {
    const { stopLogging, log } = startLogging({ log: 'spy', eventName })

    await emitEvent()

    t.true(log.calledOnce)
    t.is(hasAnsi(log.firstCall.args[0]), Boolean(supportsColor.stdout))

    stopLogging()
  })

  test(`${prefix} should allow disabling colorizing default opts.message()`, async t => {
    const { stopLogging, log } = startLogging({
      log: 'spy',
      colors: false,
      eventName,
    })

    await emitEvent()

    t.true(log.calledOnce)
    t.false(hasAnsi(log.firstCall.args[0]))

    stopLogging()
  })
})
/* eslint-enable max-nested-callbacks */
