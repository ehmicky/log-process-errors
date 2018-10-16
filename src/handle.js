'use strict'

const { exit } = require('process')
const { promisify } = require('util')

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

  if (opts.skipEvent(info)) {
    return
  }

  const colors = getColors({ opts })
  const level = getLevel({ opts, info })
  const message = getMessage({ opts, info, level, colors })

  // We need to `await` it in case we are logging an `uncaughtException` which
  // will make the process exit.
  // Without `await` Node.js would still wait until most async tasks (including
  // stream draining for logging libraries like Winston) have completed.
  // But there are some cases where it will not. In those cases, `opts.log()`
  // should be either synchronous or return a promise.
  await opts.log(message, level, info)

  await exitProcess({ eventName })
}

// Exit process on `uncaughtException`
// See https://nodejs.org/api/process.html#process_warning_using_uncaughtexception_correctly
const exitProcess = async function({ eventName }) {
  if (eventName !== 'uncaughtException') {
    return
  }

  // This is only needed as a safety measure
  await promisify(setTimeout)(EXIT_TIMEOUT)

  exit(1)
}

const EXIT_TIMEOUT = 3e3

module.exports = {
  handleEvent,
}
