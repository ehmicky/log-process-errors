'use strict'

const { platform } = require('process')

const { red, yellow, bold, dim } = require('chalk')

// Retrieve `message` which sums up all information that can be gathered about
// the event.
const getMessage = function({ eventName, promiseState, promiseValue, error }) {
  const mainMessage = getMainMessage({ eventName, error })
  const mainMessageA = prettify({ mainMessage, eventName })

  const secondMessage = getSecondMessage({ promiseState, promiseValue, error })
  const secondMessageA = indent(secondMessage)

  const message = `${mainMessageA}\n${dim(secondMessageA)}`
  return message
}

// First line of `message`
const getMainMessage = function({ eventName, error }) {
  const mainMessage = MAIN_MESSAGES[eventName]

  if (typeof mainMessage !== 'function') {
    return mainMessage
  }

  return mainMessage({ error })
}

// `warning` events use `Error.name|code|detail` in `message`
const getWarningMessage = function({ error: { code, detail } }) {
  const codeMessage = code === undefined ? '' : ` (${code})`
  const detailMessage = detail === undefined ? '' : `: ${detail}`

  return `${codeMessage}${detailMessage}`
}

// Start the message with an icon followed by `Error` or `Warning`
// Also add colors
const prettify = function({ mainMessage, eventName }) {
  if (eventName === 'warning') {
    return yellow(`${bold(` ${WARN_SIGN}  Warning`)} ${mainMessage}`)
  }

  return red(`${bold(` ${ERROR_SIGN}  Error`)}: ${mainMessage}`)
}

const isWindows = platform === 'win32'
const ERROR_SIGN = isWindows ? '×' : '\u2718'
const WARN_SIGN = isWindows ? '‼' : '\u26A0'

const MAIN_MESSAGES = {
  uncaughtException: 'uncaught exception',
  warning: getWarningMessage,
  unhandledRejection: 'a promise was rejected but not handled',
  rejectionHandled: 'a promise was handled after being already rejected',
  multipleResolves: 'a promise was resolved/rejected multiple times',
}

const getSecondMessage = function({ promiseState, promiseValue, error }) {
  if (promiseState !== undefined) {
    return getPromiseMessage({ promiseState, promiseValue })
  }

  return printError(error)
}

// `unhandledRejection`, `rejectionHandled` and `multipleResolves` events show
// the promise's resolved/rejected state and value in `message`
const getPromiseMessage = function({ promiseState, promiseValue }) {
  const value = printError(promiseValue)
  const separator = promiseValue instanceof Error ? '\n' : ' '
  return `Promise was ${promiseState} with:${separator}${value}`
}

// Print `Error.name|message|stack` if it's an `Error`. Stringify otherwise.
const printError = function(error) {
  if (!(error instanceof Error)) {
    return String(error)
  }

  const { name, message, stack } = error

  if (stack.startsWith(name)) {
    return stack
  }

  return `${name}: ${message}\n${stack}`
}

// Indent each line
const indent = function(string) {
  return string.replace(EACH_LINE_REGEXP, `\t${VERTICAL_BAR} `)
}

const EACH_LINE_REGEXP = /^/gmu

const VERTICAL_BAR = '\u2016'

module.exports = {
  getMessage,
}
