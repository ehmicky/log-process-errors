'use strict'

const {
  forEachEvent,
  startLogging,
  stubStackTrace,
  unstubStackTrace,
  emitEvents,
} = require('./helpers')

/* eslint-disable max-nested-callbacks */
forEachEvent(({ eventName, emitEvent, test }) => {
  test('should not repeat identical events', async t => {
    stubStackTrace()

    const { stopLogging, log } = startLogging({ log: 'spy', eventName })

    await emitEvents(2, emitEvent)

    t.is(log.callCount, 1)

    stopLogging()

    unstubStackTrace()
  })
})
/* eslint-enable max-nested-callbacks */
