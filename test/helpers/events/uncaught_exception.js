import { nextTick } from 'process'
import { promisify } from 'util'

// TODO: replace with `timers/promises` `setImmediate()` after dropping support
// for Node <15.0.0
const pSetImmediate = promisify(setImmediate)

// Emit an `uncaughtException` event
export const uncaughtException = async function () {
  nextTick(() => {
    const error = new Error('message')
    // `error.stack` is instantiated lazily otherwise.
    // `node-tap` handles `error.stack` too otherwise.
    // eslint-disable-next-line no-unused-expressions
    error.stack
    throw error
  })

  await pSetImmediate()
  await pSetImmediate()
}
