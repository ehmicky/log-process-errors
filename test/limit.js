import test from 'ava'
import { each } from 'test-each'

import { EVENTS } from './helpers/events/main.js'
import { startLogging } from './helpers/init.js'
import { removeProcessListeners } from './helpers/remove.js'
import { stubStackTraceRandom, unstubStackTrace } from './helpers/stack.js'

const MAX_EVENTS = 100

removeProcessListeners()

each(EVENTS, ({ title }, { eventName, emit, emitMany }) => {
  test.serial(`should limit events | ${title}`, async (t) => {
    stubStackTraceRandom()

    const { stopLogging, log } = startLogging({
      log: 'spy',
      level: { default: onlyNotLimitedWarning.bind(null, eventName) },
    })

    await emitMany(MAX_EVENTS)

    t.is(log.callCount, MAX_EVENTS)

    await emit()

    t.is(log.callCount, MAX_EVENTS)

    stopLogging()

    unstubStackTrace()
  })

  test.serial(
    `should emit warning when limiting events | ${title}`,
    async (t) => {
      stubStackTraceRandom()

      const { stopLogging, log } = startLogging({
        log: 'spy',
        level: { default: onlyLimited },
      })

      await emitMany(MAX_EVENTS)

      t.true(log.notCalled)

      await emit()

      t.true(log.called)

      stopLogging()

      unstubStackTrace()
    },
  )

  test.serial(
    `should only emit warning once when limiting events | ${title}`,
    async (t) => {
      stubStackTraceRandom()

      const { stopLogging, log } = startLogging({
        level: { default: onlyLimited },
        log: 'spy',
      })

      await emitMany(MAX_EVENTS)

      await emit()

      const { callCount } = log

      await emit()

      t.is(log.callCount, callCount)

      stopLogging()

      unstubStackTrace()
    },
  )
})

const onlyLimited = function (error) {
  if (!isLimitedWarning(error)) {
    return 'silent'
  }
}

const onlyNotLimitedWarning = function (eventName, error) {
  if (
    isLimitedWarning(error) ||
    error.name.toLowerCase() !== eventName.toLowerCase()
  ) {
    return 'silent'
  }
}

const isLimitedWarning = function ({ name, message }) {
  return name === 'Warning' && message.includes('LogProcessErrors')
}
