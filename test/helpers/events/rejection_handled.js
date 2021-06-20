import { promisify } from 'util'

// TODO: replace with `timers/promises` `setImmediate()` after dropping support
// for Node <15.0.0
const pSetImmediate = promisify(setImmediate)

// Emit a `rejectionHandled` event
export const rejectionHandled = async function () {
  const promise = Promise.reject(new Error('message'))

  await pSetImmediate()
  await pSetImmediate()

  // eslint-disable-next-line promise/prefer-await-to-then
  promise.catch(() => {})

  await pSetImmediate()
  await pSetImmediate()
}
