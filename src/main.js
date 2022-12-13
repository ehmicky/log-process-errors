import process from 'node:process'

import { EVENTS, handleEvent } from './events.js'
import { getOptions } from './options.js'
import { removeWarningListener, restoreWarningListener } from './warnings.js'

// eslint-disable-next-line no-duplicate-imports
export { validateOptions } from './options.js'

// Add event handling for all process-related errors
const logProcessErrors = (opts) => {
  const optsA = getOptions(opts)
  removeWarningListener()
  const listeners = addListeners(optsA)
  return stopLogProcessErrors.bind(undefined, listeners)
}

export default logProcessErrors

const addListeners = (opts) => EVENTS.map((event) => addListener(event, opts))

const addListener = (event, opts) => {
  const eventListener = handleEvent.bind(undefined, {
    event,
    opts,
    previousEvents: [],
  })
  process.on(event, eventListener)
  return { eventListener, event }
}

// Remove all event handlers and restore previous `warning` listeners
const stopLogProcessErrors = (listeners) => {
  listeners.forEach(removeListener)
  restoreWarningListener()
}

const removeListener = ({ eventListener, event }) => {
  process.off(event, eventListener)
}
