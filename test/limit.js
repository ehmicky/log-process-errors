import test from 'ava'
import logProcessErrors from 'log-process-errors'
import sinon from 'sinon'
import { each } from 'test-each'

// eslint-disable-next-line no-restricted-imports
import { MAX_EVENTS } from '../src/limit.js'

import { EVENTS, emit, emitManyValues } from './helpers/events.js'
import { removeProcessListeners } from './helpers/remove.js'

removeProcessListeners()

const getRandomError = function () {
  // eslint-disable-next-line fp/no-mutating-assign
  return Object.assign(new Error('test'), { stack: `  at ${Math.random()}` })
}

each(EVENTS, ({ title }, eventName) => {
  test.serial(`should limit events | ${title}`, async (t) => {
    const onError = sinon.spy()
    const stopLogging = logProcessErrors({ onError, exit: false })

    t.is(onError.callCount, 0)
    await emitManyValues(getRandomError, eventName, MAX_EVENTS + 1)
    const previousCallCount = onError.callCount
    await emit(eventName)
    t.is(onError.callCount, previousCallCount)

    stopLogging()
  })

  test.serial(`should not limit other events | ${title}`, async (t) => {
    const onError = sinon.spy()
    const stopLogging = logProcessErrors({ onError, exit: false })

    t.is(onError.callCount, 0)
    await emitManyValues(getRandomError, eventName, MAX_EVENTS + 1)
    const previousCallCount = onError.callCount
    await emit(eventName === 'warning' ? 'uncaughtException' : 'warning')
    t.is(onError.callCount, previousCallCount + 1)

    stopLogging()
  })

  test.serial(`should print a warning on limit | ${title}`, async (t) => {
    const onError = sinon.spy()
    const stopLogging = logProcessErrors({ onError, exit: false })

    await emitManyValues(getRandomError, eventName, MAX_EVENTS + 1)
    t.is(onError.args[onError.args.length - 1][1], 'warning')

    stopLogging()
  })
})
