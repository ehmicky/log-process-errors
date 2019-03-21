'use strict'

const test = require('ava')

const { repeatEvents, startLogging } = require('./helpers')

repeatEvents((prefix, { emitEvent }) => {
  test(`${prefix} events emitters should exist`, t => {
    t.is(typeof emitEvent, 'function')
  })

  test(`${prefix} events emitters should not throw`, async t => {
    const { stopLogging } = startLogging()

    await t.notThrowsAsync(emitEvent)

    stopLogging()
  })
})
