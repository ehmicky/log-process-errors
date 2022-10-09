import process from 'process'

import fakeTimers from '@sinonjs/fake-timers'
import sinon from 'sinon'

// Stub `setTimeout()` and `process.exit()`
export const stubProcessClock = function () {
  stubProcessExit()
  return fakeTimers.install({ toFake: ['setTimeout'] })
}

// Stub `process.exit()`
export const stubProcessExit = function () {
  sinon.stub(process, 'exit')
}

export const unStubProcessClock = function (clock) {
  unStubProcessExit()
  clock.uninstall()
}

export const unStubProcessExit = function () {
  process.exit.restore()
  process.exitCode = undefined
}
