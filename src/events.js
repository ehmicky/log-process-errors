import { getError } from './error.js'
import { exitProcess } from './exit.js'
import { isLimited } from './limit.js'
import { isRepeated } from './repeat.js'

export const EVENTS = [
  'uncaughtException',
  'unhandledRejection',
  'rejectionHandled',
  'warning',
]

export const handleEvent = async (
  { event, opts: { onError, exit }, previousEvents },
  value,
  origin,
) => {
  const valueA = await resolveValue(value, event)

  if (
    isDoubleRejection(event, origin) ||
    isLimited(valueA, event, previousEvents) ||
    isRepeated(valueA, previousEvents)
  ) {
    return
  }

  const error = getError(valueA, event)
  await onError(error, event)
  exitProcess(exit, event)
}

// `rejectionHandled` pass a `Promise` as argument. The other events pass the
// main value as is.
const resolveValue = async (value, event) => {
  if (event !== 'rejectionHandled') {
    return value
  }

  try {
    return await value
  } catch (error) {
    return error
  }
}

// With `--unhandled-rejections=strict`, `unhandledRejection` also emits an
// `uncaughtException` event. We discard it to avoid repetitions.
const isDoubleRejection = (event, origin) =>
  event === 'uncaughtException' && origin === 'unhandledRejection'
