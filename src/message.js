'use strict'

const { platform } = require('process')
const { inspect } = require('util')

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
  const message = MESSAGES[eventName]({
    promiseState,
    promiseValue,
    secondPromiseState,
    secondPromiseValue,
    error,
  })

  const level = eventName === 'warning' ? 'warn' : 'error'
  const messageA = prettify({ message, level, eventName })
  return messageA
}

const uncaughtException = function({ error }) {
  return `An exception was thrown but not caught
${printValue(error)}`
}

const warning = function({ error, error: { code, detail = '' } }) {
  const codeMessage = code === undefined ? '' : `(${code}) `
  return `${codeMessage}${detail}
${printValue(error)}`
}

const unhandledRejection = function({ promiseValue }) {
  return `A promise was rejected but not handled
Promise was rejected with: ${serialize(promiseValue)}`
}

const rejectionHandled = function({ promiseValue }) {
  return `A promise was handled after being already rejected
Promise was rejected with: ${serialize(promiseValue)}`
}

const multipleResolves = function({
  promiseState,
  promiseValue,
  secondPromiseState,
  secondPromiseValue,
}) {
  const again = promiseState === secondPromiseState ? ' again' : ''
  return `A promise was resolved/rejected multiple times
Promise was initially ${promiseState} with: ${serialize(promiseValue)}
Promise was then ${secondPromiseState}${again} with: ${serialize(
    secondPromiseValue,
  )}`
}

const MESSAGES = {
  uncaughtException,
  warning,
  unhandledRejection,
  rejectionHandled,
  multipleResolves,
}

const serialize = function(value) {
  const valueA = printValue(value)
  // Print multiline values on the next line
  const valueB = valueA.includes('\n') ? `\n${valueA}` : valueA
  return valueB
}

const printValue = function(value) {
  if (value instanceof Error) {
    return value.stack
  }

  return inspect(value)
}

const prettify = function({ message, level, eventName }) {
  const [header, ...lines] = message.split('\n')

  // Add color, icon and `eventName` to first message line.
  const { COLOR, SIGN } = LEVELS[level]
  const headerA = COLOR(`${bold(inverse(` ${SIGN}  ${eventName} `))} ${header}`)
  // Add gray color and indentation to other lines.
  const linesA = lines.map(line => dim(`\t${VERTICAL_BAR} ${line}`))

  const messageA = [headerA, ...linesA].join('\n')
  return messageA
}

// Start the message with an icon followed by `Error` or `Warning`
// Also add colors
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

const VERTICAL_BAR = '\u2016'

module.exports = {
  getMessage,
}
