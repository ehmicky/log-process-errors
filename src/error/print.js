'use strict'

const { circleFilled, info, warning, cross } = require('figures')

const { getChalk } = require('../colors')

// Pretty-print error on the console (which uses `util.inspect()`)
const printError = function({
  opts: { colors },
  level,
  name,
  error: { message },
  stack,
}) {
  const [messageA, ...details] = message.split(':')
  const detailsA = details.join(':')

  const {
    chalk,
    chalk: { bold, dim, inverse, italic },
  } = getChalk(colors)

  // Add color, sign and `event.name` to first message line, and concatenate
  // `firstLine`
  const { COLOR, SIGN } = LEVELS[level]
  const header = chalk[COLOR](
    `${inverse(
      bold(` ${SIGN}  ${name} ${italic(`(${messageA})`)} `),
    )}${detailsA}`,
  )

  const stackA = dim(stack)

  return `${header}\n${stackA}`
}

// Each level is printed in a different way
const LEVELS = {
  debug: { COLOR: 'blue', SIGN: circleFilled },
  info: { COLOR: 'green', SIGN: info },
  warn: { COLOR: 'yellow', SIGN: warning },
  error: { COLOR: 'red', SIGN: cross },
}

module.exports = {
  printError,
}
