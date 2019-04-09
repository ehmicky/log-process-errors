import { nextTick } from 'process'
import { promisify } from 'util'

const pSetImmediate = promisify(setImmediate)

// Emit an `uncaughtException` event
export const uncaughtException = async function() {
  nextTick(() => {
    throw new Error('message')
  })

  await pSetImmediate()
  await pSetImmediate()
}
