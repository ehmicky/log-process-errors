'use strict'

const test = require('ava')

const {
  repeatEvents,
  startLogging,
  ALL_EVENTS: { all },
} = require('./helpers')

test('[all] events emitters should not throw', async t => {
  const { stopLogging } = startLogging()

  await t.notThrowsAsync(all)

  stopLogging()
})

/* eslint-disable max-nested-callbacks */
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
/* eslint-enable max-nested-callbacks */
