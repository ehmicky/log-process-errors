'use strict'

const test = require('ava')

const {
  repeatEvents,
  startLogging,
  stubStackTrace,
  unstubStackTrace,
  emitEvents,
} = require('./helpers')

/* eslint-disable max-nested-callbacks */
repeatEvents((prefix, { eventName, emitEvent }) => {
  test(`${prefix} should not repeat identical events`, async t => {
    stubStackTrace()

    const { stopLogging, log } = startLogging({ log: 'spy', eventName })

    await emitEvents(2, emitEvent)

    t.is(log.callCount, 3)

    stopLogging()

    unstubStackTrace()
  })
})
/* eslint-enable max-nested-callbacks */
