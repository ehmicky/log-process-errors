import { emitWarning } from 'process'
import { promisify } from 'util'

// TODO: replace with `timers/promises` `setImmediate()` after dropping support
// for Node <15.0.0
const pSetImmediate = promisify(setImmediate)

// Emit a `warning` event
export const warning = async function ({ all = false } = {}) {
  const props = all ? WARNING_PROPS : [WARNING_PROPS[0]]
  props.forEach(createWarning)

  await pSetImmediate()
}

const createWarning = function ({ code, detail }, index) {
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
