'use strict'

const { emitWarning } = require('process')
const { promisify } = require('util')

const pSetImmediate = promisify(setImmediate)

// Emit a `warning` event
const warning = async function() {
  emitWarning('message', { type: 'WarningType', code: '500', detail: 'Detail' })

  await pSetImmediate()
}

module.exports = {
  warning,
}
