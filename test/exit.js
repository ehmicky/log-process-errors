import process from 'process'
import { promisify } from 'util'

import fakeTimers from '@sinonjs/fake-timers'
import test from 'ava'
import sinon from 'sinon'
import { each } from 'test-each'

import { EVENTS } from './helpers/events.js'
import { startLogging } from './helpers/init.js'
import { removeProcessListeners } from './helpers/remove.js'

const pNextTick = promisify(process.nextTick)

const EXIT_TIMEOUT = 3000
const EXIT_STATUS = 1

removeProcessListeners()

// Stub `process.exit()`
const stubProcessExit = function () {
  const clock = fakeTimers.install({ toFake: ['setTimeout'] })
  const processExit = sinon.stub(process, 'exit')
  return { clock, processExit }
}

const unstubProcessExit = function ({ clock, processExit }) {
  processExit.restore()
  clock.uninstall()
}

const emitAndWait = async function (timeout, { clock, emit }) {
  await emit()
  clock.tick(timeout)
}

each(EVENTS, ({ title }, { eventName, emit }) => {
  test.serial(
    `should process.exit(1) if inside exitOn | ${title}`,
    async (t) => {
      const { clock, processExit } = stubProcessExit()

      const exitOn = [eventName]
      const { stopLogging } = startLogging({ exitOn, eventName })

      await emitAndWait(EXIT_TIMEOUT, { clock, emit })

      t.is(processExit.callCount, 1)
      t.is(processExit.firstCall.args[0], EXIT_STATUS)

      stopLogging()

      unstubProcessExit({ clock, processExit })
    },
  )

  test.serial(
    `should not process.exit(1) if not inside exitOn | ${title}`,
    async (t) => {
      const { clock, processExit } = stubProcessExit()

      const exitOn = []
      const { stopLogging } = startLogging({ exitOn, eventName })

      await emitAndWait(EXIT_TIMEOUT, { clock, emit })

      t.true(processExit.notCalled)

      stopLogging()

      unstubProcessExit({ clock, processExit })
    },
  )

  test.serial(`should delay process.exit(1) | ${title}`, async (t) => {
    const { clock, processExit } = stubProcessExit()

    const { stopLogging } = startLogging({ exitOn: [eventName], eventName })

    await emitAndWait(EXIT_TIMEOUT - 1, { clock, emit })

    t.true(processExit.notCalled)

    clock.tick(1)
    t.true(processExit.called)

    stopLogging()

    unstubProcessExit({ clock, processExit })
  })

  test.serial(
    `should delay process.exit(1) with async opts.log() | ${title}`,
    // eslint-disable-next-line max-statements
    async (t) => {
      const { clock, processExit } = stubProcessExit()

      // eslint-disable-next-line fp/no-let, init-declarations
      let resolveA
      // eslint-disable-next-line promise/avoid-new
      const promise = new Promise((resolve) => {
        // eslint-disable-next-line fp/no-mutation
        resolveA = resolve
      })

      const { stopLogging } = startLogging({
        exitOn: [eventName],
        eventName,
        // We use `async` keyword to make sure they are validated correctly
        async log() {
          await promise
        },
      })

      await emitAndWait(EXIT_TIMEOUT, { clock, emit })

      t.true(processExit.notCalled)

      resolveA()
      await pNextTick()
      clock.tick(EXIT_TIMEOUT)

      t.true(processExit.called)

      stopLogging()

      unstubProcessExit({ clock, processExit })
    },
  )
})
