'use strict'

// Default `opts.log`
const defaultLog = function(error, level) {
  // Note that `console` should be referenced inside this function, not outside,
  // as user might monkey patch it.
  // We defined `error[util.custom.inspect]`, so `error` will use it for pretty
  // printing.
  // eslint-disable-next-line no-restricted-globals, no-console
  console[level](error)
}

module.exports = {
  defaultLog,
}
