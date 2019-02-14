'use strict'

const { serialize } = require('./serialize')
const { prettify } = require('./prettify')

// Retrieve `message` which sums up all information that can be gathered about
// the event.
const getMessage = function({ opts, info, level, colors }) {
  const message = opts.message({ ...info, level, colors })
  // Ensure this is a string
  const messageA = typeof message === 'string' ? message : serialize(message)
  return messageA
}

// Default `opts.message()`
const defaultMessage = function({
  eventName,
  rejected,
  promiseValue,
  nextRejected,
  nextValue,
  error,
  level,
  colors,
}) {
  const message = MESSAGES[eventName]({
    rejected,
    promiseValue,
    nextRejected,
    nextValue,
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

// The default level is `info` because it does not always indicate an
// error: https://github.com/nodejs/node/issues/24321
const multipleResolves = function({
  rejected,
  promiseValue,
  nextRejected,
  nextValue,
}) {
  const rejectedStr = REJECTED_NAME[rejected]
  const nextRejectedStr = REJECTED_NAME[nextRejected]
  const again = rejected === nextRejected ? ' again' : ''
  const state = again ? rejectedStr : 'resolved/rejected'

  return ` (a promise was ${state} multiple times)
Initially ${rejectedStr} with: ${serialize(promiseValue)}
Then ${nextRejectedStr}${again} with: ${serialize(nextValue)}`
}

const REJECTED_NAME = {
  true: 'rejected',
  false: 'resolved',
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
  defaultMessage,
}
