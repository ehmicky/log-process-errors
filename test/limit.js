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
      eventName,
      spy: true,
      log: onlyNotLimited,
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
        eventName,
        spy: true,
        log: onlyLimited,
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
        eventName,
        spy: true,
        log: onlyLimited,
      })

      await emitMany(MAX_EVENTS)

      await emit()

      const { callCount } = log

      await emit()

      const { callCount: newCallCount } = log
      t.is(newCallCount, callCount)

      stopLogging()

      unstubStackTrace()
    },
  )
})

const onlyLimited = function (error) {
  if (isLimitedWarning(error)) {
    // eslint-disable-next-line no-restricted-globals, no-console
    console.error(error)
  }
}

const onlyNotLimited = function (error) {
  if (!isLimitedWarning(error)) {
    // eslint-disable-next-line no-restricted-globals, no-console
    console.error(error)
  }
}

const isLimitedWarning = function ({ name, message }) {
  return name === 'Warning' && message.includes('LogProcessErrors')
}
