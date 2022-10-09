import test from 'ava'
import logProcessErrors from 'log-process-errors'
import sinon from 'sinon'
import { each } from 'test-each'

// eslint-disable-next-line no-restricted-imports
import { MAX_EVENTS } from '../src/limit.js'

import { getRandomStackError } from './helpers/error.js'
import { EVENTS, emit, emitManyValues } from './helpers/events.js'
import { removeProcessListeners } from './helpers/remove.js'

removeProcessListeners()

each(EVENTS, ({ title }, eventName) => {
  test.serial(`should limit events | ${title}`, async (t) => {
    const onError = sinon.spy()
    const stopLogging = logProcessErrors({ onError, exit: false })

    t.is(onError.callCount, 0)
    await emitManyValues(getRandomStackError, eventName, MAX_EVENTS + 1)
    const previousCallCount = onError.callCount
    await emit(eventName)
    t.is(onError.callCount, previousCallCount)

    stopLogging()
  })

  test.serial(`should not limit other events | ${title}`, async (t) => {
    const onError = sinon.spy()
    const stopLogging = logProcessErrors({ onError, exit: false })

    t.is(onError.callCount, 0)
    await emitManyValues(getRandomStackError, eventName, MAX_EVENTS + 1)
    const previousCallCount = onError.callCount
    await emit(eventName === 'warning' ? 'uncaughtException' : 'warning')
    t.is(onError.callCount, previousCallCount + 1)

    stopLogging()
  })

  test.serial(`should print a warning on limit | ${title}`, async (t) => {
    const onError = sinon.spy()
    const stopLogging = logProcessErrors({ onError, exit: false })

    await emitManyValues(getRandomStackError, eventName, MAX_EVENTS + 1)
    t.is(onError.args[onError.args.length - 1][1], 'warning')

    stopLogging()
  })
})
