'use strict'

// Default `opts.log`
const defaultLog = function(message, level) {
  const levelA = fixLevel(level)

  // Note that `console` should be referenced inside this function, not outside,
  // as user might monkey patch it.
  // eslint-disable-next-line no-restricted-globals, no-console
  console[levelA](message)
}

// `console.debug()` does not exist in Node.js <8
// TODO: remove once dropping support for Node.js <8
const fixLevel = function(level) {
  // eslint-disable-next-line no-restricted-globals, no-console
  if (console[level] === undefined) {
    return 'info'
  }

  return level
}

module.exports = {
  defaultLog,
}
