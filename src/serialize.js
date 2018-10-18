'use strict'

const { inspect } = require('util')

const { LEVELS } = require('./level')

const serialize = function(value) {
  if (value instanceof Error) {
    return value.stack
  }

  return inspect(value)
}

const prettify = function({
  message,
  eventName,
  level,
  colors,
  colors: { bold, dim, inverse },
}) {
  const [header, ...lines] = message.split('\n')

  // Add color, icon and `eventName` to first message line.
  const { COLOR, SIGN } = LEVELS[level]
  const headerA = colors[COLOR](
    `${bold(inverse(` ${SIGN}  ${eventName} `))} ${header}`,
  )
  // Add gray color and indentation to other lines.
  const linesA = lines.map(line => dim(`${INDENT}${line}`))

  const messageA = [headerA, ...linesA].join('\n')
  return messageA
}

const INDENT_SIZE = 4
const INDENT = ' '.repeat(INDENT_SIZE)

module.exports = {
  serialize,
  prettify,
}
