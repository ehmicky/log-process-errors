import test from 'ava'
import testEach from 'test-each'

// Required directly because this is exposed through documentation, but not
// through code
import { MAX_EVENTS } from '../src/limit.js'

import { EVENTS } from './helpers/events/main.js'
import { startLogging } from './helpers/init.js'
import { stubStackTraceRandom, unstubStackTrace } from './helpers/stack.js'
import { removeProcessListeners } from './helpers/remove.js'

removeProcessListeners()

testEach(EVENTS, ({ name }, { eventName, emitEvent, emitMany }) => {
  test.serial(`should limit events | ${name}`, async t => {
    stubStackTraceRandom()

    const { stopLogging, log } = startLogging({
      log: 'spy',
      level: { default: onlyNotLimitedWarning.bind(null, eventName) },
    })

    await emitMany(MAX_EVENTS)

    t.is(log.callCount, MAX_EVENTS)

    await emitEvent()

    t.is(log.callCount, MAX_EVENTS)

    stopLogging()

    unstubStackTrace()
  })

  test.serial(`should emit warning when limiting events | ${name}`, async t => {
    stubStackTraceRandom()

    const { stopLogging, log } = startLogging({
      log: 'spy',
      level: { default: onlyLimited },
    })

    await emitMany(MAX_EVENTS)

    t.true(log.notCalled)

    await emitEvent()

    t.true(log.called)

    stopLogging()

    unstubStackTrace()
  })

  test.serial(
    `should only emit warning once when limiting events | ${name}`,
    async t => {
      stubStackTraceRandom()

      const { stopLogging, log } = startLogging({
        level: { default: onlyLimited },
        log: 'spy',
      })

      await emitMany(MAX_EVENTS)

      await emitEvent()

      const { callCount } = log

      await emitEvent()

      t.is(log.callCount, callCount)

      stopLogging()

      unstubStackTrace()
    },
  )
})

const onlyLimited = function(error) {
  if (!isLimitedWarning(error)) {
    return 'silent'
  }
}

const onlyNotLimitedWarning = function(eventName, error) {
  if (
    isLimitedWarning(error) ||
    error.name.toLowerCase() !== eventName.toLowerCase()
  ) {
    return 'silent'
  }
}

const isLimitedWarning = function({ name, message }) {
  return name === 'Warning' && message.includes('LogProcessErrors')
}
