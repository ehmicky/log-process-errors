'use strict'

const hasAnsi = require('has-ansi')
const supportsColor = require('supports-color')

const { forEachEvent, startLogging } = require('./helpers')

/* eslint-disable max-nested-callbacks */
forEachEvent(({ eventName, emitEvent, test }) => {
  test('should colorize default opts.getMessage()', async t => {
    const { stopLogging, log } = startLogging({ log: 'spy', eventName })

    await emitEvent()

    t.true(log.calledOnce)
    t.is(hasAnsi(log.firstCall.args[0]), Boolean(supportsColor.stdout))

    stopLogging()
  })

  test('should allow forcing colorizing default opts.getMessage()', async t => {
    const { stopLogging, log } = startLogging({
      log: 'spy',
      colors: true,
      eventName,
    })

    await emitEvent()

    t.true(log.calledOnce)
    t.true(hasAnsi(log.firstCall.args[0]))

    stopLogging()
  })

  test('should allow disabling colorizing default opts.getMessage()', async t => {
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
