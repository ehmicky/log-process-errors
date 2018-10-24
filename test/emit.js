'use strict'

const { forEachEvent, startLogging } = require('./helpers')

/* eslint-disable max-nested-callbacks */
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
