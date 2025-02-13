import test from 'ava'
import { each } from 'test-each'

import {
  getInvalidError,
  getObjectError,
  getRandomMessageError,
} from './helpers/error.test.js'
import {
  emitMany,
  emitManyValues,
  EVENTS,
  getCallCount,
} from './helpers/events.test.js'
import { removeProcessListeners } from './helpers/remove.test.js'
import { startLogging } from './helpers/start.test.js'

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

  test.serial(
    `should not repeat values that are invalid errors | ${title}`,
    async (t) => {
      if (eventName === 'rejectionHandled') {
        return t.pass()
      }

      const { onError, stopLogging } = startLogging()

      t.is(onError.callCount, 0)
      await emitManyValues(getInvalidError, eventName, 2)
      t.is(onError.callCount, getCallCount(eventName))

      stopLogging()
    },
  )
})

removeProcessListeners()
