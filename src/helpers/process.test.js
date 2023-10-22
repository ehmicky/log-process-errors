import process from 'node:process'

import { spy } from 'sinon'

// Spy on process event handlers
export const setProcessEvent = (eventName) => {
  const processHandler = spy()
  process.on(eventName, processHandler)
  return processHandler
}

// Revert
export const unsetProcessEvent = (eventName, processHandler) => {
  process.off(eventName, processHandler)
}
