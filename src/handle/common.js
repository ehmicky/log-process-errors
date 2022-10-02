import { getError } from '../error/main.js'
import { exitProcess } from '../exit.js'
import { isLimited } from '../limit.js'
import { isRepeated } from '../repeat.js'

import { getEvent } from './event.js'

// Generic event handler for all events.
export const handleEvent = async function ({
  opts,
  name,
  previousEvents,
  mEmitLimitedWarning,
  promise,
  value,
  nextRejected,
  nextValue,
}) {
  if (isLimited({ previousEvents, mEmitLimitedWarning, name, value })) {
    return
  }

  const event = await getEvent({
    name,
    promise,
    value,
    nextRejected,
    nextValue,
  })

  if (isRepeated({ event, previousEvents })) {
    return
  }

  const error = getError({ name, event })
  // See `exit.js` on why we need to `await`
  await opts.log(error, name)
  await exitProcess({ name, opts })
}
