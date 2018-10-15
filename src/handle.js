'use strict'

const { exit } = require('process')

const { parsePromise } = require('./promise')
const { getMessage } = require('./message')

// Generic event handler for all events.
const handleEvent = async function({
  opts: { handlerFunc, exitOnExceptions },
  eventName,
  error,
  promise,
  promiseValue,
}) {
  debugger
  const { promiseState, promiseValue: promiseValueA } = await parsePromise({
    eventName,
    promise,
    promiseValue,
  })
  const message = getMessage({
    eventName,
    promiseState,
    promiseValue: promiseValueA,
    error,
  })

  handlerFunc({
    eventName,
    promiseState,
    promiseValue: promiseValueA,
    error,
    message,
  })

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
