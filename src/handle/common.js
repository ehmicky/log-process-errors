import { getError, addErrorPrint } from '../error/main.js'
import { exitProcess } from '../exit.js'
import { getLevel } from '../level.js'
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

  await logEvent({ opts, name, event })

  await exitProcess({ name, opts })
}

const logEvent = async function ({ opts, name, event }) {
  const { error, stack } = getError({ name, event })

  const level = getLevel({ opts, name, error })

  if (level === 'silent') {
    return
  }

  addErrorPrint({ error, opts, level, name, stack })

  // See `exit.js` on why we need to `await`
  await opts.log(error, level)
}
