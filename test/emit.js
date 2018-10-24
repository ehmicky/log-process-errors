'use strict'

const test = require('ava')

const {
  ALL_EVENTS: { all },
} = require('../helpers')

const { forEachEvent, startLogging } = require('./helpers')

test('[all] events emitters should not throw', async t => {
  const { stopLogging } = startLogging()

  await t.notThrowsAsync(all)

  stopLogging()
})

/* eslint-disable max-nested-callbacks */
// eslint-disable-next-line no-shadow
forEachEvent(({ emitEvent, test }) => {
  test('events emitters should exist', t => {
    t.is(typeof emitEvent, 'function')
  })

  test('events emitters should not throw', async t => {
    const { stopLogging } = startLogging()

    await t.notThrowsAsync(emitEvent)

    stopLogging()
  })
})
/* eslint-enable max-nested-callbacks */
