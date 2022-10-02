import { getError } from './error/main.js'
import { exitProcess } from './exit.js'
import { isLimited } from './limit.js'
import { isRepeated } from './repeat.js'

// List of all handled events
export const EVENTS = {
  uncaughtException(context, value) {
    handleEvent({ ...context, value })
  },
  warning(context, value) {
    handleEvent({ ...context, value })
  },
  unhandledRejection(context, value, promise) {
    handleEvent({ ...context, promise, value })
  },
  rejectionHandled(context, promise) {
    handleEvent({ ...context, promise })
  },
}

// Generic event handler for all events
const handleEvent = async function ({
  opts: { log, keep },
  reason,
  previousEvents,
  mEmitLimitedWarning,
  promise,
  value,
}) {
  if (isLimited({ previousEvents, mEmitLimitedWarning, reason, value })) {
    return
  }

  const valueA = await getValue(reason, promise, value)

  if (isRepeated(valueA, previousEvents)) {
    return
  }

  const error = getError(reason, valueA)
  await log(error, reason)
  await exitProcess(keep, reason)
}

const getValue = async function (reason, promise, value) {
  if (reason !== 'rejectionHandled') {
    return value
  }

  try {
    return await promise
  } catch (error) {
    return error
  }
}
