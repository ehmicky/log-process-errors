import { getError } from './error.js'
import { exitProcess } from './exit.js'
import { isLimited } from './limit.js'
import { isRepeated } from './repeat.js'

// All event handlers
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

const handleEvent = async function (
  value,
  { opts: { log, keep }, reason, previousEvents },
) {
  if (
    isLimited(value, reason, previousEvents) ||
    isRepeated(value, previousEvents)
  ) {
    return
  }

  const error = getError(value, reason)
  await log(error, reason)
  await exitProcess(keep, reason)
}
