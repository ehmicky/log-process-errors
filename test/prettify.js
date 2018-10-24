'use strict'

const {
  forEachEventLevel,
  startLogging,
  stubStackTrace,
  unstubStackTrace,
} = require('./helpers')

/* eslint-disable max-nested-callbacks */
forEachEventLevel(({ eventName, emitEvent, level, test }) => {
  test('should fire opts.getMessage() with a default prettifier', async t => {
    stubStackTrace()

    const { stopLogging, log } = startLogging({
      log: 'spy',
      level,
      colors: false,
      eventName,
    })

    await emitEvent()

    t.true(log.calledOnce)
    t.snapshot(log.lastCall.args[0])

    stopLogging()

    unstubStackTrace()
  })
})
/* eslint-enable max-nested-callbacks */
