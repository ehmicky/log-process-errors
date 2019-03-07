'use strict'

const { circleFilled, info, warning, cross } = require('figures')

const { getChalk } = require('./colors')

const prettify = function({ message, name, level, opts: { colors } }) {
  const [explanation, firstLine, ...lines] = message.split('\n')

  const {
    chalk,
    chalk: { bold, dim, inverse, italic },
  } = getChalk(colors)

  // Add color, sign and `event.name` to first message line, and concatenate
  // `firstLine`
  const { COLOR, SIGN } = LEVELS[level]
  const header = chalk[COLOR](
    `${inverse(bold(` ${SIGN}  ${name}${italic(explanation)} `))} ${firstLine}`,
  )

  // Add gray color and indentation to other lines.
  const linesA = lines.map(line => dim(`${INDENT}${line}`))

  const messageA = [header, ...linesA].join('\n')
  return messageA
}

// Each level is printed in a different way
const LEVELS = {
  debug: { COLOR: 'blue', SIGN: circleFilled },
  info: { COLOR: 'green', SIGN: info },
  warn: { COLOR: 'yellow', SIGN: warning },
  error: { COLOR: 'red', SIGN: cross },
}

const INDENT_SIZE = 4
const INDENT = ' '.repeat(INDENT_SIZE)

module.exports = {
  prettify,
}
