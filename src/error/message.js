import { inspect } from 'util'

import { isErrorInstance } from './check.js'

// Retrieve the `error.message` using the `event` information
export const getMessage = function (value, reason) {
  return MESSAGES[reason](value)
}

const uncaughtException = function (value) {
  return `an exception was thrown but not caught: ${serialize(value)}`
}

const warning = function (value) {
  return `${serialize(value)}${getWarningDetails(value)}`
}

const getWarningDetails = function ({ code, detail = '' }) {
  if (code !== undefined) {
    return `\n[${code}] ${detail}`
  }

  return detail === '' ? '' : `\n${detail}`
}

const unhandledRejection = function (value) {
  return `a promise was rejected but not handled: ${serialize(value)}`
}

const rejectionHandled = function (value) {
  return `a promise was rejected and handled too late: ${serialize(value)}`
}

const MESSAGES = {
  uncaughtException,
  warning,
  unhandledRejection,
  rejectionHandled,
}

// We use `util.inspect()` instead of `JSON.stringify()` or a third-party
// library because it has nice output.
// Do not print `Error.stack`, but print `Error.name` + `Error.message`
const serialize = function (value) {
  return isErrorInstance(value) ? String(value) : inspect(value, INSPECT_OPTS)
}

const INSPECT_OPTS = { getters: true }
