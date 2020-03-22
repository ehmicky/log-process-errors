import { promisify } from 'util'

const pSetImmediate = promisify(setImmediate)

// Emit an `unhandledRejection` event
export const unhandledRejection = async function () {
  // eslint-disable-next-line promise/catch-or-return
  Promise.reject(new Error('message'))

  await pSetImmediate()
}
