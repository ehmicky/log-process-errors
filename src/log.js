'use strict'

// Default `opts.log`
const defaultLog = function(message, level) {
  // eslint-disable-next-line no-restricted-globals, no-console
  console[level](message)
}

module.exports = {
  defaultLog,
}
