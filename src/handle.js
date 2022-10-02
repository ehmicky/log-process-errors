import { getError } from './error/main.js'
import { exitProcess } from './exit.js'
import { isLimited } from './limit.js'
import { isRepeated } from './repeat.js'

// List of all handled events
export const EVENTS = {
  uncaughtException(context, value, origin) {
    if (origin !== 'unhandledRejection') {
      handleEvent(value, context)
    }
  },
  unhandledRejection(context, value) {
    handleEvent(value, context)
  },
  async rejectionHandled(context, promise) {
    const value = await resolvePromise(promise)
    handleEvent(value, context)
  },
  warning(context, value) {
    handleEvent(value, context)
  },
}

const resolvePromise = async function (promise) {
  try {
    return await promise
  } catch (error) {
    return error
  }
}

// Generic event handler for all events
const handleEvent = async function (
  value,
  { opts: { log, keep }, reason, previousEvents, mEmitLimitedWarning },
) {
  const isError = isErrorInstance(value)

  if (
    isLimited({ previousEvents, mEmitLimitedWarning, reason, value }) ||
    isRepeated(value, previousEvents)
  ) {
    return
  }

  const error = getError(value, isError, reason)
  await log(error, reason)
  await exitProcess(keep, reason)
}

const isErrorInstance = function (value) {
  return Object.prototype.toString.call(value) === '[object Error]'
}
