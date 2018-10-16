'use strict'

const { exit } = require('process')

const { getInfo } = require('./info')
const { getColors } = require('./colors')
const { getLevel } = require('./level')
const { getMessage } = require('./message')

// Generic event handler for all events.
const handleEvent = async function({
  opts,
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

  if (!opts.filter(info)) {
    return
  }

  const colors = getColors({ opts })
  const level = getLevel({ opts, info })
  const message = getMessage({ opts, info, level, colors })

  opts.log(message, level, info)

  exitProcess({ eventName, opts })
}

// Exit process on `uncaughtException`
// See https://nodejs.org/api/process.html#process_warning_using_uncaughtexception_correctly
// Can be disabled with `opts.exitOnExceptions: false`
const exitProcess = function({ eventName, opts: { exitOnExceptions } }) {
  if (eventName !== 'uncaughtException' || !exitOnExceptions) {
    return
  }

  exit(1)
}

module.exports = {
  handleEvent,
}
