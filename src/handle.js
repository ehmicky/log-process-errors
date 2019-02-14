'use strict'

const { getInfo } = require('./info')
const { isLimited } = require('./limit')
const { isRepeated } = require('./repeat')
const { getColors } = require('./colors')
const { getLevel } = require('./level')
const { getMessage } = require('./message')
const { exitProcess } = require('./exit')

// Generic event handler for all events.
const handleEvent = async function({
  opts,
  eventName,
  previousEvents,
  mEmitLimitedWarning,
  error,
  promise,
  value,
  nextRejected,
  nextValue,
}) {
  if (isLimited({ previousEvents, mEmitLimitedWarning, eventName, error })) {
    return
  }

  const info = await getInfo({
    eventName,
    error,
    promise,
    value,
    nextRejected,
    nextValue,
  })

  if (isRepeated({ info, previousEvents })) {
    return
  }

  await logEvent({ opts, info })

  await exitProcess({ eventName, opts })
}

const logEvent = async function({ opts, info }) {
  const level = getLevel({ opts, info })

  if (level === 'silent') {
    return
  }

  const colors = getColors({ opts })
  const message = getMessage({ opts, info, level, colors })

  // We need to `await` it in case `opts.exitOn` exits the process.
  // Without `await` Node.js would still wait until most async tasks (including
  // stream draining for logging libraries like Winston) have completed.
  // But there are some cases where it will not. In those cases, `opts.log()`
  // should be either synchronous or return a promise.
  await opts.log(message, level, info)
}

module.exports = {
  handleEvent,
}
