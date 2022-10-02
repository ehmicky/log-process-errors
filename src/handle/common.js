import { getError } from '../error/main.js'
import { exitProcess } from '../exit.js'
import { isLimited } from '../limit.js'
import { isRepeated } from '../repeat.js'

import { getEvent } from './event.js'

// Generic event handler for all events.
export const handleEvent = async function ({
  opts: { log, keep },
  reason,
  previousEvents,
  mEmitLimitedWarning,
  promise,
  value,
  nextRejected,
  nextValue,
}) {
  if (isLimited({ previousEvents, mEmitLimitedWarning, reason, value })) {
    return
  }

  const event = await getEvent({
    reason,
    promise,
    value,
    nextRejected,
    nextValue,
  })

  if (isRepeated(event, previousEvents)) {
    return
  }

  const error = getError(reason, event)
  // See `exit.js` on why we need to `await`
  await log(error, reason)
  await exitProcess(keep, reason)
}
