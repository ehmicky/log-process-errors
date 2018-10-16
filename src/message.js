'use strict'

const { platform } = require('process')

const { red, yellow, bold, dim, inverse } = require('chalk')

// Retrieve `message` which sums up all information that can be gathered about
// the event.
const getMessage = function({
  eventName,
  promiseState,
  promiseValue,
  secondPromiseState,
  secondPromiseValue,
  error,
}) {
  const header = getHeader({ eventName, error })

  const content = getContent({
    promiseState,
    promiseValue,
    secondPromiseState,
    secondPromiseValue,
    error,
  })

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
const getWarningHeader = function({ error: { code, detail = '' } }) {
  const codeMessage = code === undefined ? '' : `(${code}) `
  return `${codeMessage}${detail}`
}

const HEADERS = {
  uncaughtException: 'Uncaught exception',
  warning: getWarningHeader,
  unhandledRejection: 'A promise was rejected but not handled',
  rejectionHandled: 'A promise was handled after being already rejected',
  multipleResolves: 'A promise was resolved/rejected multiple times',
}

// Start the message with an icon followed by `Error` or `Warning`
// Also add colors
const prettifyHeader = function({ header, eventName }) {
  const level = eventName === 'warning' ? 'warn' : 'error'
  const { COLOR, SIGN } = LEVELS[level]

  return COLOR(`${bold(inverse(` ${SIGN}  ${eventName} `))} ${header}`)
}

const isWindows = platform === 'win32'
const LEVELS = {
  warn: {
    COLOR: yellow,
    SIGN: isWindows ? '\u203C' : '\u26A0',
  },
  error: {
    COLOR: red,
    SIGN: isWindows ? '\u00D7' : '\u2718',
  },
}

const getContent = function({
  promiseState,
  promiseValue,
  secondPromiseState,
  secondPromiseValue,
  error,
}) {
  const content =
    promiseState === undefined
      ? printValue(error)
      : getPromiseContent({
          promiseState,
          promiseValue,
          secondPromiseState,
          secondPromiseValue,
        })
  const contentA = indentContent(content)
  return contentA
}

// `unhandledRejection`, `rejectionHandled` and `multipleResolves` events show
// the promise's resolved/rejected state and value in `message`
const getPromiseContent = function({
  promiseState,
  promiseValue,
  secondPromiseState,
  secondPromiseValue,
}) {
  if (secondPromiseState === undefined) {
    return `Promise was ${promiseState} with: ${serialize(promiseValue)}`
  }

  const again = promiseState === secondPromiseState ? ' again' : ''
  return `Promise was initially ${promiseState} with: ${serialize(promiseValue)}
Promise was then ${secondPromiseState}${again} with: ${serialize(
    secondPromiseValue,
  )}`
}

const serialize = function(value) {
  const valueA = printValue(value)
  // Print multiline values on the next line
  const valueB = valueA.includes('\n') ? `\n${valueA}` : valueA
  return valueB
}

const printValue = function(value) {
  if (value instanceof Error) {
    return printError(value)
  }

  return String(value)
}

// Print `Error.name|message|stack` if it's an `Error`. Stringify otherwise.
const printError = function({ name, message, stack }) {
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
