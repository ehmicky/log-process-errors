import { inspect } from 'util'

// Retrieve the `error.message` using the `event` information
export const getMessage = function ({ event, name }) {
  return MESSAGES[name](event)
}

const uncaughtException = function ({ value }) {
  return `an exception was thrown but not caught: ${serialize(value)}`
}

const warning = function ({ value, value: { code, detail } }) {
  return `${serialize(value)}${getWarningDetails({ code, detail })}`
}

const getWarningDetails = function ({ code, detail = '' }) {
  if (code !== undefined) {
    return `\n[${code}] ${detail}`
  }

  if (detail !== '') {
    return `\n${detail}`
  }

  return ''
}

const unhandledRejection = function ({ value }) {
  return `a promise was rejected but not handled: ${serialize(value)}`
}

const rejectionHandled = function ({ value }) {
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
const serialize = function (value) {
  // Do not print `Error.stack`, but print `Error.name` + `Error.message`
  if (value instanceof Error) {
    return String(value)
  }

  return inspect(value, INSPECT_OPTS)
}

const INSPECT_OPTS = { getters: true }
