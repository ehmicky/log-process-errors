'use strict'

const { isLimited } = require('../limit')
const { isRepeated } = require('../repeat')
const { getLevel } = require('../level')
const { getError, addErrorPrint } = require('../error')
const { exitProcess } = require('../exit')

const { getEvent } = require('./event')

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

  await logEvent({ opts, name, event })

  await exitProcess({ name, opts })
}

const logEvent = async function({ opts, name, event }) {
  const { error, message, stack } = getError({ name, event })

  const level = getLevel({ opts, name, error })

  if (level === 'silent') {
    return
  }

  addErrorPrint({ error, opts, level, name, message, stack })

  // See `exit.js` on why we need to `await`
  await opts.log(error, level)
}

module.exports = {
  handleEvent,
}
