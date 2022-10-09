import process from 'process'

import fakeTimers from '@sinonjs/fake-timers'
import sinon from 'sinon'

import { setProcessEvent, unsetProcessEvent } from './process.js'
import { startLogging } from './start.js'

// Start logging while a specific process event handler is being used, and
// `process.exit()` is being stubbed
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

// Start logging while `setTimeout()` and `process.exit()` are being stubbed
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

// Start logging while `process.exit()` is being stubbed
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
