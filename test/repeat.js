import test from 'ava'
import { each } from 'test-each'

import { getRandomMessageError, getObjectError } from './helpers/error.js'
import {
  EVENTS,
  emitMany,
  emitManyValues,
  getCallCount,
} from './helpers/events.js'
import { removeProcessListeners } from './helpers/remove.js'
import { startLogging } from './helpers/start.js'

each(EVENTS, ({ title }, eventName) => {
  test.serial(`should not repeat identical events | ${title}`, async (t) => {
    const { onError, stopLogging } = startLogging()

    t.is(onError.callCount, 0)
    await emitMany(eventName, 2)
    t.is(onError.callCount, getCallCount(eventName))

    stopLogging()
  })

  test.serial(
    `can repeat identical events between different loggers | ${title}`,
    async (t) => {
      const { onError: onErrorOne, stopLogging: stopLoggingOne } =
        startLogging()
      const { onError: onErrorTwo, stopLogging: stopLoggingTwo } =
        startLogging()

      t.is(onErrorOne.callCount, 0)
      t.is(onErrorTwo.callCount, 0)
      await emitMany(eventName, 2)
      t.is(onErrorOne.callCount, getCallCount(eventName))
      t.is(onErrorTwo.callCount, getCallCount(eventName))

      stopLoggingOne()
      stopLoggingTwo()
    },
  )

  test.serial(
    `should not repeat errors with same stack but different message | ${title}`,
    async (t) => {
      const { onError, stopLogging } = startLogging()

      t.is(onError.callCount, 0)
      await emitManyValues(getRandomMessageError, eventName, 2)
      t.is(onError.callCount, getCallCount(eventName))

      stopLogging()
    },
  )

  test.serial(
    `should not repeat values that are not error instances | ${title}`,
    async (t) => {
      const { onError, stopLogging } = startLogging()

      t.is(onError.callCount, 0)
      await emitManyValues(
        getObjectError.bind(undefined, eventName),
        eventName,
        2,
      )
      t.is(onError.callCount, getCallCount(eventName))

      stopLogging()
    },
  )
})

removeProcessListeners()
