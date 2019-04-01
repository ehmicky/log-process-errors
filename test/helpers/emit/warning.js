'use strict'

const { emitWarning } = require('process')
const { promisify } = require('util')

const pSetImmediate = promisify(setImmediate)

// Emit a `warning` event
const warning = async function({ all = false } = {}) {
  const props = all ? WARNING_PROPS : [WARNING_PROPS[0]]
  props.forEach(createWarning)

  await pSetImmediate()
}

const createWarning = function({ code, detail }, index) {
  // Ensure events are not skipped because they look like repeated events.
  const type = index === 0 ? 'WarningType' : `WarningType${index}`

  emitWarning('message', { type, code, detail })
}

const WARNING_PROPS = [
  { code: '500', detail: 'Detail' },
  { code: '500' },
  { detail: 'Detail' },
  {},
]

module.exports = {
  warning,
}
