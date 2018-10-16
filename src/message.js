'use strict'

const { platform } = require('process')

const { red, yellow, bold, dim } = require('chalk')

// Retrieve `message` which sums up all information that can be gathered about
// the event.
const getMessage = function({ eventName, promiseState, promiseValue, error }) {
  const header = getHeader({ eventName, error })

  const content = getContent({ promiseState, promiseValue, error })

  const message = `${header}\n${dim(content)}`
  return message
}

// First line of `message`
const getHeader = function({ eventName, error }) {
  const header = HEADERS[eventName]
  const headerA = typeof header === 'function' ? header({ error }) : header
  const headerB = prettifyHeader({ header: headerA, eventName })
  return headerB
}

// `warning` events use `Error.name|code|detail` in `message`
const getWarningHeader = function({ error: { code, detail } }) {
  const codeMessage = code === undefined ? '' : ` (${code})`
  const detailMessage = detail === undefined ? '' : `: ${detail}`

  return `${codeMessage}${detailMessage}`
}

const HEADERS = {
  uncaughtException: 'uncaught exception',
  warning: getWarningHeader,
  unhandledRejection: 'a promise was rejected but not handled',
  rejectionHandled: 'a promise was handled after being already rejected',
  multipleResolves: 'a promise was resolved/rejected multiple times',
}

// Start the message with an icon followed by `Error` or `Warning`
// Also add colors
const prettifyHeader = function({ header, eventName }) {
  if (eventName === 'warning') {
    return yellow(`${bold(` ${WARN_SIGN}  Warning`)} ${header}`)
  }

  return red(`${bold(` ${ERROR_SIGN}  Error`)}: ${header}`)
}

const isWindows = platform === 'win32'
const ERROR_SIGN = isWindows ? '\u00D7' : '\u2718'
const WARN_SIGN = isWindows ? '\u203C' : '\u26A0'

const getContent = function({ promiseState, promiseValue, error }) {
  const content =
    promiseState === undefined
      ? printError(error)
      : getPromiseContent({ promiseState, promiseValue })
  const contentA = indentContent(content)
  return contentA
}

// `unhandledRejection`, `rejectionHandled` and `multipleResolves` events show
// the promise's resolved/rejected state and value in `message`
const getPromiseContent = function({ promiseState, promiseValue }) {
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
const indentContent = function(string) {
  return string.replace(EACH_LINE_REGEXP, `\t${VERTICAL_BAR} `)
}

const EACH_LINE_REGEXP = /^/gmu

const VERTICAL_BAR = '\u2016'

module.exports = {
  getMessage,
}
