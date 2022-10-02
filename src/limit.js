import { emitWarning } from 'process'

// We only allow 100 events per `reason` for the global process because:
//  - Process errors are exceptional and if more than 100 happen, this is
//    probably due to some infinite recursion.
//  - The `repeated` logic should prevents reaching the threshold
//  - `previousEvents` might otherwise take too much memory and/or create a
//    memory leak.
//  - It prevents infinite recursions if `opts.log()` triggers itself an event.
//    The `repeated` logic should prevent it most of the times, but it can still
//    happen when `[next]Value` is not an `Error` instance and contain dynamic
//    content.
export const isLimited = function ({
  previousEvents,
  mEmitLimitedWarning,
  reason,
  value,
}) {
  if (isLimitedWarning(reason, value)) {
    return false
  }

  const isLimitedEvent = [...previousEvents].length >= MAX_EVENTS

  if (isLimitedEvent) {
    mEmitLimitedWarning(reason)
  }

  return isLimitedEvent
}

// Notify that limit has been reached with a `warning` event
export const emitLimitedWarning = function (reason) {
  emitWarning(ERROR_MESSAGE(reason), ERROR_NAME, ERROR_CODE)
}

// The `warning` itself should not be skipped
const isLimitedWarning = function (reason, value = {}) {
  return (
    reason === 'warning' &&
    value.name === ERROR_NAME &&
    value.code === ERROR_CODE
  )
}

const ERROR_MESSAGE = (reason) =>
  `Cannot log more than ${MAX_EVENTS} '${reason}' until process is restarted`
const ERROR_NAME = 'LogProcessErrors'
const ERROR_CODE = 'TooManyErrors'

const MAX_EVENTS = 100
