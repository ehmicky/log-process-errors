import test from 'ava'
import logProcessErrors from 'log-process-errors'
import sinon from 'sinon'
import { each } from 'test-each'

import { EVENTS, emitMany, emitManyValues } from './helpers/events.js'
import { removeProcessListeners } from './helpers/remove.js'

removeProcessListeners()

const getRandomError = function () {
  return new Error(String(Math.random()))
}

const getObjectError = function (eventName) {
  return eventName === 'warning' ? 'test' : { message: 'test' }
}

each(EVENTS, ({ title }, eventName) => {
  test.serial(`should not repeat identical events | ${title}`, async (t) => {
    const onError = sinon.spy()
    const stopLogging = logProcessErrors({ onError, exit: false })

    t.is(onError.callCount, 0)
    await emitMany(eventName, 2)
    t.is(onError.callCount, eventName === 'rejectionHandled' ? 2 : 1)

    stopLogging()
  })

  test.serial(
    `can repeat identical events between different loggers | ${title}`,
    async (t) => {
      const onError = sinon.spy()
      const stopLoggingOne = logProcessErrors({ onError })
      const stopLoggingTwo = logProcessErrors({ onError })

      t.is(onError.callCount, 0)
      await emitMany(eventName, 2)
      t.is(onError.callCount, 2 * (eventName === 'rejectionHandled' ? 2 : 1))

      stopLoggingOne()
      stopLoggingTwo()
    },
  )

  test.serial(
    `should not repeat errors with same stack but different message | ${title}`,
    async (t) => {
      const onError = sinon.spy()
      const stopLogging = logProcessErrors({ onError, exit: false })

      t.is(onError.callCount, 0)
      await emitManyValues(getRandomError, eventName, 2)
      t.is(onError.callCount, eventName === 'rejectionHandled' ? 2 : 1)

      stopLogging()
    },
  )

  test.serial(
    `should not repeat values that are not error instances | ${title}`,
    async (t) => {
      const onError = sinon.spy()
      const stopLogging = logProcessErrors({ onError, exit: false })

      t.is(onError.callCount, 0)
      await emitManyValues(
        getObjectError.bind(undefined, eventName),
        eventName,
        2,
      )
      t.is(onError.callCount, eventName === 'rejectionHandled' ? 2 : 1)

      stopLogging()
    },
  )
})
