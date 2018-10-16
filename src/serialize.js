'use strict'

const { inspect } = require('util')

const { bold, dim, inverse } = require('chalk')

const { LEVELS } = require('./level')

const printMultiline = function(value) {
  const valueA = print(value)
  // Print multiline values on the next line
  const valueB = valueA.includes('\n') ? `\n${valueA}` : valueA
  return valueB
}

const print = function(value) {
  if (value instanceof Error) {
    return value.stack
  }

  return inspect(value)
}

const prettify = function({ message, eventName, level }) {
  const [header, ...lines] = message.split('\n')

  // Add color, icon and `eventName` to first message line.
  const { COLOR, SIGN } = LEVELS[level]
  const headerA = COLOR(`${bold(inverse(` ${SIGN}  ${eventName} `))} ${header}`)
  // Add gray color and indentation to other lines.
  const linesA = lines.map(line => dim(`\t${VERTICAL_BAR} ${line}`))

  const messageA = [headerA, ...linesA].join('\n')
  return messageA
}

const VERTICAL_BAR = '\u2016'

module.exports = {
  printMultiline,
  print,
  prettify,
}
