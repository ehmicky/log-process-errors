'use strict'

const { inspect } = require('util')

// Retrieve the `error.message` using the `event` information
const getMessage = function({ event, name }) {
  return MESSAGES[name](event)
}

const uncaughtException = function({ value }) {
  return `an exception was thrown but not caught: ${serialize(value)}`
}

const warning = function({ value, value: { code, detail } }) {
  const codeMessage = code === undefined ? '' : `${code}: `
  const detailMessage = detail === undefined ? '' : `\n${detail}`
  return `${codeMessage}${serialize(value)}${detailMessage}`
}

const unhandledRejection = function({ value }) {
  return `a promise was rejected but not handled: ${serialize(value)}`
}

const rejectionHandled = function({ value }) {
  return `a promise was rejected and handled too late: ${serialize(value)}`
}

// The default level is `event` because it does not always indicate an error:
// https://github.com/nodejs/node/issues/24321
const multipleResolves = function({
  rejected,
  value,
  nextRejected,
  nextValue,
}) {
  const rejectedStr = REJECTED_NAME[rejected]
  const nextRejectedStr = REJECTED_NAME[nextRejected]
  // istanbul ignore next
  const again = rejected === nextRejected ? ' again' : ''
  // istanbul ignore next
  const state = again ? rejectedStr : 'resolved/rejected'

  return `a promise was ${state} multiple times:
Initially ${rejectedStr} with: ${serialize(value)}
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

// We use `util.inspect()` instead of `JSON.stringify()` or a third-party
// library because it has nice output.
const serialize = function(value) {
  // Do not print `Error.stack`, but print `Error.name` + `Error.message`
  if (value instanceof Error) {
    return String(value)
  }

  return inspect(value, INSPECT_OPTS)
}

// Default `depth` changes from Node.js 11.0 to 11.3
const INSPECT_OPTS = { depth: 2, getters: true }

module.exports = {
  getMessage,
}
