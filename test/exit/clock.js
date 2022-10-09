import process, { nextTick } from 'process'
import { promisify } from 'util'

import test from 'ava'

// eslint-disable-next-line no-restricted-imports
import { EXIT_TIMEOUT, EXIT_CODE } from '../../src/exit.js'
import { emit } from '../helpers/events.js'
import { startClockLogging } from '../helpers/exit.js'
import { removeProcessListeners } from '../helpers/remove.js'

const pNextTick = promisify(nextTick)
removeProcessListeners()

const advanceClock = function (t, clock) {
  t.deepEqual(process.exit.args, [])
  clock.tick(EXIT_TIMEOUT)
  t.deepEqual(process.exit.args, [[EXIT_CODE]])
}

test.serial('call process.exit() after a timeout', async (t) => {
  const { clock, stopLogging } = startClockLogging({ exit: true })

  await emit('uncaughtException')
  advanceClock(t, clock)

  stopLogging()
})

test.serial('wait for async onError() before exiting', async (t) => {
  const onErrorDuration = 1e5
  const { clock, stopLogging } = startClockLogging({
    async onError() {
      await promisify(setTimeout)(onErrorDuration)
    },
    exit: true,
  })

  await emit('uncaughtException')
  clock.tick(onErrorDuration)
  await pNextTick()
  advanceClock(t, clock)

  stopLogging()
})
