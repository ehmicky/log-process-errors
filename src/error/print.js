'use strict'

const { circleFilled, info, warning, cross } = require('figures')

const { getChalk } = require('../colors')

// Pretty-print error on the console (which uses `util.inspect()`)
const printError = function({ opts: { colors }, level, name, message, stack }) {
  const {
    chalk,
    chalk: { dim },
  } = getChalk(colors)

  const header = getHeader({ level, name, message, chalk })
  const stackA = dim(stack)
  return `${header}\n${stackA}`
}

// Add color, sign and `event.name` to first message line
const getHeader = function({
  level,
  name,
  message,
  chalk,
  chalk: { italic, inverse, bold },
}) {
  const { message: messageA, details } = splitMessage({ message })

  const { COLOR, SIGN } = LEVELS[level]
  const prefix = ` ${SIGN}  ${name} ${italic(`(${messageA})`)} `
  const header = `${inverse(bold(prefix))}${details}`
  const headerA = chalk[COLOR](header)
  return headerA
}

const splitMessage = function({ message }) {
  const [messageA, ...details] = message.split(':')
  const detailsA = details.join(':')
  return { message: messageA, details: detailsA }
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
