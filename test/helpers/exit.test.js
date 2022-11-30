import process from 'node:process'

import fakeTimers from '@sinonjs/fake-timers'
import sinon from 'sinon'

import { setProcessEvent, unsetProcessEvent } from './process.test.js'
import { startLogging } from './start.test.js'

// Start logging and stub `process.exit()`, while a specific process event
// handler is being used
export const startProcessLogging = function (eventName, opts) {
  const processHandler = setProcessEvent(eventName)
  const stopLogging = startExitLogging(opts)
  return stopProcessLogging.bind(
    undefined,
    eventName,
    stopLogging,
    processHandler,
  )
}

const stopProcessLogging = function (eventName, stopLogging, processHandler) {
  stopLogging()
  unsetProcessEvent(eventName, processHandler)
}

// Start logging and stub `process.exit()` and `setTimeout()`
export const startClockLogging = function (opts) {
  const clock = fakeTimers.install({ toFake: ['setTimeout'] })
  const stopLogging = startExitLogging(opts)
  const stopLoggingA = stopClockLogging.bind(undefined, stopLogging, clock)
  return { clock, stopLogging: stopLoggingA }
}

const stopClockLogging = function (stopLogging, clock) {
  stopLogging()
  clock.uninstall()
}

// Start logging and stub `process.exit()`
export const startExitLogging = function (opts) {
  sinon.stub(process, 'exit')
  const { stopLogging } = startLogging(opts)
  return stopExitLogging.bind(undefined, stopLogging)
}

const stopExitLogging = function (stopLogging) {
  stopLogging()
  process.exit.restore()
  process.exitCode = undefined
}
