import { promisify } from 'util'

// TODO: replace with `timers/promises` `setImmediate()` after dropping support
// for Node <15.0.0
const pSetImmediate = promisify(setImmediate)

// Emit an `unhandledRejection` event
export const unhandledRejection = async function () {
  // eslint-disable-next-line promise/catch-or-return
  Promise.reject(new Error('message'))

  await pSetImmediate()
}
