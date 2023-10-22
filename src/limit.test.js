import test from 'ava'
import { each } from 'test-each'

import { getRandomStackError } from './helpers/error.test.js'
import { EVENTS, emit, emitManyValues } from './helpers/events.test.js'
import { removeProcessListeners } from './helpers/remove.test.js'
import { startLogging } from './helpers/start.test.js'
// eslint-disable-next-line no-restricted-imports
import { MAX_EVENTS } from './limit.js'

each(EVENTS, ({ title }, eventName) => {
  test.serial(`should limit events | ${title}`, async (t) => {
    const { onError, stopLogging } = startLogging()

    t.is(onError.callCount, 0)
    await emitManyValues(getRandomStackError, eventName, MAX_EVENTS + 1)
    const previousCallCount = onError.callCount
    await emit(eventName)
    t.is(onError.callCount, previousCallCount)

    stopLogging()
  })

  test.serial(`should not limit other events | ${title}`, async (t) => {
    const { onError, stopLogging } = startLogging()

    await emitManyValues(getRandomStackError, eventName, MAX_EVENTS + 1)
    const previousCallCount = onError.callCount
    await emit(eventName === 'warning' ? 'uncaughtException' : 'warning')
    t.is(onError.callCount, previousCallCount + 1)

    stopLogging()
  })

  test.serial(`should print a warning on limit | ${title}`, async (t) => {
    const { onError, stopLogging } = startLogging()

    await emitManyValues(getRandomStackError, eventName, MAX_EVENTS + 1)
    t.is(onError.args.at(-1)[1], 'warning')

    stopLogging()
  })
})

removeProcessListeners()
