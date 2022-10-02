import { inspect } from 'util'

// Retrieve the `error.message` using the `event` information
export const getMessage = function (value, isError, reason) {
  const valueString = serialize(value, isError)
  return MESSAGES[reason](valueString, value)
}

// We use `util.inspect()` instead of `JSON.stringify()` or a third-party
// library because it has nice output.
// Do not print `Error.stack`, but print `Error.name` + `Error.message`
const serialize = function (value, isError) {
  return isError ? String(value) : inspect(value, INSPECT_OPTS)
}

const INSPECT_OPTS = { getters: true }

const uncaughtException = function (valueString) {
  return `an exception was thrown but not caught: ${valueString}`
}

const unhandledRejection = function (valueString) {
  return `a promise was rejected but not handled: ${valueString}`
}

const rejectionHandled = function (valueString) {
  return `a promise was rejected and handled too late: ${valueString}`
}

const warning = function (valueString, value) {
  return `${valueString}${getWarningDetails(value)}`
}

const getWarningDetails = function ({ code, detail = '' }) {
  if (code !== undefined) {
    return `\n[${code}] ${detail}`
  }

  return detail === '' ? '' : `\n${detail}`
}

const MESSAGES = {
  uncaughtException,
  unhandledRejection,
  rejectionHandled,
  warning,
}
