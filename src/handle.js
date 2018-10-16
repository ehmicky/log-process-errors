'use strict'

const { exit } = require('process')

const { getInfo } = require('./info')
const { getLevel } = require('./level')
const { getMessage } = require('./message')

// Generic event handler for all events.
const handleEvent = async function({
  opts,
  opts: { handlerFunc, exitOnExceptions },
  eventName,
  error,
  promise,
  promiseValue,
  secondPromiseState,
  secondPromiseValue,
}) {
  const info = await getInfo({
    eventName,
    error,
    promise,
    promiseValue,
    secondPromiseState,
    secondPromiseValue,
  })

  const { level, levelInfo } = getLevel({ opts, info })
  const message = getMessage({ ...info, levelInfo })

  handlerFunc(message, level, info)

  exitProcess({ eventName, exitOnExceptions })
}

// Exit process on `uncaughtException`
// See https://nodejs.org/api/process.html#process_warning_using_uncaughtexception_correctly
// Can be disabled with `opts.exitOnExceptions: false`
const exitProcess = function({ eventName, exitOnExceptions }) {
  if (eventName !== 'uncaughtException' || !exitOnExceptions) {
    return
  }

  exit(1)
}

module.exports = {
  handleEvent,
}
