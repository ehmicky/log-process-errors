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
  // TODO: replace to `emitWarning(message, { type, code, detail })` and
  // remove `new Error()` once support for Node <=7 is dropped
  const error = new Error(message)
  // eslint-disable-next-line fp/no-mutating-assign
  Object.assign(error, { name: type, code, detail })
  emitWarning(error)

  await pSetImmediate()
}

module.exports = {
  warning,
}
