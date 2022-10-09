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

// Start logging while `process.exit()` is being stubbed
export const startExitLogging = function (opts) {
  stubProcessExit()
  return stopExitLogging.bind(undefined, startLogging(opts).stopLogging)
}

const stopExitLogging = function (stopLogging) {
  stopLogging()
  unStubProcessExit()
}

// Stub `setTimeout()` and `process.exit()`
export const stubProcessClock = function () {
  stubProcessExit()
  return fakeTimers.install({ toFake: ['setTimeout'] })
}

export const unStubProcessClock = function (clock) {
  unStubProcessExit()
  clock.uninstall()
}

// Stub `process.exit()`
const stubProcessExit = function () {
  sinon.stub(process, 'exit')
}

const unStubProcessExit = function () {
  process.exit.restore()
  process.exitCode = undefined
}
