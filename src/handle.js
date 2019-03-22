'use strict'

const { getEvent } = require('./event')
const { isLimited } = require('./limit')
const { isRepeated } = require('./repeat')
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

  const message = getMessage({ opts, event, level })

  // See `exit.js` on why we need to `await`
  await opts.log(message, level, event)
}

module.exports = {
  handleEvent,
}
