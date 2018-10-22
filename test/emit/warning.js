'use strict'

const { emitWarning } = require('process')
const { promisify } = require('util')

const { defaultWarning } = require('./default')

// Emit a `warning` event
const warning = async function({
  message,
  type,
  code,
  detail,
} = defaultWarning) {
  emitWarning(message, { type, code, detail })

  await promisify(setImmediate)()
}

module.exports = {
  warning,
}
