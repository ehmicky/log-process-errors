'use strict'

const { getEvent } = require('./event')
const { isLimited } = require('./limit')
const { isRepeated } = require('./repeat')
const { getColors } = require('./colors')
const { getLevel } = require('./level')
const { getMessage } = require('./message')
const { exitProcess } = require('./exit')

// Generic event handler for all events.
const handleEvent = async function({
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

  await logEvent({ opts, event })

  await exitProcess({ name, opts })
}

const logEvent = async function({ opts, event }) {
  const level = getLevel({ opts, event })

  if (level === 'silent') {
    return
  }

  const colors = getColors({ opts })
  const message = getMessage({ opts, event, level, colors })

  // We need to `await` it in case `opts.exitOn` exits the process.
  // Without `await` Node.js would still wait until most async tasks (including
  // stream draining for logging libraries like Winston) have completed.
  // But there are some cases where it will not. In those cases, `opts.log()`
  // should be either synchronous or return a promise.
  await opts.log(message, level, event)
}

module.exports = {
  handleEvent,
}
