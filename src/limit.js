import { emitWarning } from 'process'

// We only allow 100 events per `event` for the global process because:
//  - Process errors are exceptional and if more than 100 happen, this is
//    probably due to some infinite recursion.
//  - The `repeated` logic should prevents reaching the threshold
//  - `previousEvents` might otherwise take too much memory and/or create a
//    memory leak.
//  - It prevents infinite recursions if `opts.onError()` triggers itself an
//    event.
//    The `repeated` logic should prevent it most of the times, but it can still
//    happen when `value` is not an `Error` instance and contain dynamic content
export const isLimited = function (value, event, previousEvents) {
  if (previousEvents.length < MAX_EVENTS || isLimitedWarning(event, value)) {
    return false
  }

  emitWarning(`${PREFIX} "${event}" until process is restarted.`)
  return true
}

// The `warning` itself should not be skipped
const isLimitedWarning = function (event, value) {
  return event === 'warning' && value.message.startsWith(PREFIX)
}

export const MAX_EVENTS = 100
const PREFIX = `Cannot log more than ${MAX_EVENTS}`
