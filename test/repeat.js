'use strict'

const test = require('ava')

const {
  repeatEvents,
  startLogging,
  stubStackTrace,
  unstubStackTrace,
  emitEvents,
} = require('./helpers')

repeatEvents((prefix, { name, emitEvent }) => {
  test(`${prefix} should not repeat identical events`, async t => {
    stubStackTrace()

    const { stopLogging, log } = startLogging({ log: 'spy', name })

    await emitEvents(2, emitEvent)

    t.is(log.callCount, 1)

    stopLogging()

    unstubStackTrace()
  })
})
