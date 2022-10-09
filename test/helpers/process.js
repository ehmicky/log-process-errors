import process from 'process'

import sinon from 'sinon'

// Spy on process event handlers
export const setProcessEvent = function (eventName) {
  const processHandler = sinon.spy()
  process.on(eventName, processHandler)
  return processHandler
}

// Revert
export const unsetProcessEvent = function (eventName, processHandler) {
  process.off(eventName, processHandler)
}
