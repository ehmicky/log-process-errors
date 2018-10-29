'use strict'

const { inspect } = require('util')

const { serialize, prettify } = require('./prettify')

// Retrieve `message` which sums up all information that can be gathered about
// the event.
const getMessage = function({ opts, info, level, colors }) {
  const message = opts.getMessage({ ...info, level, colors })
  // Ensure this is a string
  const messageA =
    typeof message === 'string' ? message : inspect(message, INSPECT_OPTS)
  return messageA
}

// Default `depth` changes with Node.js 11
const INSPECT_OPTS = { depth: 2 }

// Default `opts.getMessage()`
const defaultGetMessage = function({
  eventName,
  promiseState,
  promiseValue,
  secondPromiseState,
  secondPromiseValue,
  error,
  level,
  colors,
}) {
  const message = MESSAGES[eventName]({
    promiseState,
    promiseValue,
    secondPromiseState,
    secondPromiseValue,
    error,
  })

  const messageA = prettify({ message, eventName, level, colors })
  return messageA
}

const uncaughtException = function({ error }) {
  return ` (an exception was thrown but not caught)
${serialize(error)}`
}

const warning = function({ error, error: { code, detail } }) {
  const codeMessage = code === undefined ? '' : `(${code}) `
  const detailMessage = detail === undefined ? '' : `${detail}\n`
  return `
${codeMessage}${detailMessage}${serialize(error)}`
}

const unhandledRejection = function({ promiseValue }) {
  return ` (a promise was rejected but not handled)
${serialize(promiseValue)}`
}

const rejectionHandled = function({ promiseValue }) {
  return ` (a promise was rejected and handled too late)
${serialize(promiseValue)}`
}

const multipleResolves = function({
  promiseState,
  promiseValue,
  secondPromiseState,
  secondPromiseValue,
}) {
  // istanbul ignore next
  const again = promiseState === secondPromiseState ? ' again' : ''
  // istanbul ignore next
  const state = again ? promiseState : 'resolved/rejected'

  return ` (a promise was ${state} multiple times)
Initially ${promiseState} with: ${serialize(promiseValue)}
Then ${secondPromiseState}${again} with: ${serialize(secondPromiseValue)}`
}

const MESSAGES = {
  uncaughtException,
  warning,
  unhandledRejection,
  rejectionHandled,
  multipleResolves,
}

module.exports = {
  getMessage,
  defaultGetMessage,
}
