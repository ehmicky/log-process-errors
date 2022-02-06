import { fileURLToPath } from 'url'

import test from 'ava'
import sinon from 'sinon'
import { each } from 'test-each'

import { EVENTS, EVENTS_MAP } from './helpers/events/main.js'
import { hasOldExitBehavior } from './helpers/events/version.js'
import { startLogging } from './helpers/init.js'
import { normalizeMessage, normalizeCall } from './helpers/normalize.js'
import { removeProcessListeners } from './helpers/remove.js'

const LOAD_HELPER = fileURLToPath(new URL('helpers/load.js', import.meta.url))

removeProcessListeners()

const {
  warning: { emit },
} = EVENTS_MAP

test.serial('[warning] should disable default event handlers', async (t) => {
  // eslint-disable-next-line no-restricted-globals
  const stub = sinon.stub(console, 'error')

  const { stopLogging, log } = startLogging({ log: 'spy', colors: false })

  await emit()

  t.true(log.calledOnce)
  t.snapshot(String(log.lastCall.args[0]))

  t.true(stub.notCalled)

  stopLogging()

  stub.restore()
})

test.serial(
  '[warning] should multiply restore default event handlers',
  async (t) => {
    // eslint-disable-next-line no-restricted-globals
    const stub = sinon.stub(console, 'error')

    const { stopLogging } = startLogging()
    startLogging().stopLogging()

    await emit()

    t.true(stub.notCalled)

    stopLogging()

    await emit()

    t.true(stub.calledOnce)
    t.snapshot(normalizeMessage(String(stub.lastCall.args[0])))

    stub.restore()
  },
)

each(
  EVENTS,
  [
    '--no-warnings',
    '--unhandled-rejections=none',
    '--unhandled-rejections=strict',
  ],
  ({ title }, { eventName }, flag) => {
    test(`should work with warnings-related CLI flags | ${title}`, async (t) => {
      if (hasOldExitBehavior(eventName)) {
        return t.pass()
      }

      t.snapshot(
        await normalizeCall(`node ${flag} ${LOAD_HELPER} ${eventName}`, {
          colors: false,
        }),
      )
    })
  },
)
