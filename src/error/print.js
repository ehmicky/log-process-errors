import figures from 'figures'

// Pretty-print error on the console (which uses `util.inspect()`)
export const printError = function ({ level, name, message, stack }) {
  const [messageA, ...details] = message.split(':')
  const detailsA = details.join(':')
  return ` ${SIGNS[level]}  ${name} ${`(${messageA})`} ${detailsA}\n${stack}`
}

// Each level is printed in a different way
const SIGNS = {
  debug: figures.circleFilled,
  info: figures.info,
  warn: figures.warning,
  error: figures.cross,
}
