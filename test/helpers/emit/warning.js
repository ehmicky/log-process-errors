'use strict'

const { emitWarning } = require('process')

const promisify = require('util.promisify')

const { defaultWarning } = require('./default')

const pSetImmediate = promisify(setImmediate)

// Emit a `warning` event
const warning = async function({
  message,
  type,
  code,
  detail,
} = defaultWarning) {
  emitWarning(message, { type, code, detail })

  await pSetImmediate()
}

module.exports = {
  warning,
}
