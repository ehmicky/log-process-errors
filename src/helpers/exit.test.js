import process from 'node:process'

import fakeTimers from '@sinonjs/fake-timers'
import sinon from 'sinon'

import { setProcessEvent, unsetProcessEvent } from './process.test.js'
import { startLogging } from './start.test.js'

// Start logging and stub `process.exit()`, while a specific process event
// handler is being used
export const startProcessLogging = (eventName, opts) => {
  const processHandler = setProcessEvent(eventName)
  const stopLogging = startExitLogging(opts)
  return stopProcessLogging.bind(
    undefined,
    eventName,
    stopLogging,
    processHandler,
  )
}

const stopProcessLogging = (eventName, stopLogging, processHandler) => {
  stopLogging()
  unsetProcessEvent(eventName, processHandler)
}

// Start logging and stub `process.exit()` and `setTimeout()`
export const startClockLogging = (opts) => {
  const clock = fakeTimers.install({ toFake: ['setTimeout'] })
  const stopLogging = startExitLogging(opts)
  const stopLoggingA = stopClockLogging.bind(undefined, stopLogging, clock)
  return { clock, stopLogging: stopLoggingA }
}

const stopClockLogging = (stopLogging, clock) => {
  stopLogging()
  clock.uninstall()
}

// Start logging and stub `process.exit()`
export const startExitLogging = (opts) => {
  sinon.stub(process, 'exit')
  const { stopLogging } = startLogging(opts)
  return stopExitLogging.bind(undefined, stopLogging)
}

const stopExitLogging = (stopLogging) => {
  stopLogging()
  process.exit.restore()
  process.exitCode = undefined
}
