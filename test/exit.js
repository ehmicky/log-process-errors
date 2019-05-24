import process from 'process'
import { promisify } from 'util'

import test from 'ava'
import sinon from 'sinon'
import lolex from 'lolex'

// Required directly because this is exposed through documentation, but not
// through code
import { EXIT_TIMEOUT, EXIT_STATUS } from '../src/exit.js'

import { testEach } from './helpers/data_driven/main.js'
import { EVENT_DATA } from './helpers/repeat.js'
import { startLogging } from './helpers/init.js'
import { removeProcessListeners } from './helpers/remove.js'

const pNextTick = promisify(process.nextTick)

removeProcessListeners()

// Stub `process.exit()`
const stubProcessExit = function() {
  const clock = lolex.install({ toFake: ['setTimeout'] })
  const processExit = sinon.stub(process, 'exit')
  return { clock, processExit }
}

const unstubProcessExit = function({ clock, processExit }) {
  processExit.restore()
  clock.uninstall()
}

const emitEventAndWait = async function(timeout, { clock, emitEvent }) {
  await emitEvent()
  clock.tick(timeout)
}

testEach(EVENT_DATA, ({ name }, { eventName, emitEvent }) => {
  test.serial(`should process.exit(1) if inside exitOn | ${name}`, async t => {
    const { clock, processExit } = stubProcessExit()

    const exitOn = [eventName]
    const { stopLogging } = startLogging({ exitOn, eventName })

    await emitEventAndWait(EXIT_TIMEOUT, { clock, emitEvent })

    t.is(processExit.callCount, 1)
    t.is(processExit.firstCall.args[0], EXIT_STATUS)

    stopLogging()

    unstubProcessExit({ clock, processExit })
  })

  test.serial(
    `should not process.exit(1) if not inside exitOn | ${name}`,
    async t => {
      const { clock, processExit } = stubProcessExit()

      const exitOn = []
      const { stopLogging } = startLogging({ exitOn, eventName })

      await emitEventAndWait(EXIT_TIMEOUT, { clock, emitEvent })

      t.true(processExit.notCalled)

      stopLogging()

      unstubProcessExit({ clock, processExit })
    },
  )

  test.serial(`should delay process.exit(1) | ${name}`, async t => {
    const { clock, processExit } = stubProcessExit()

    const { stopLogging } = startLogging({ exitOn: [eventName], eventName })

    await emitEventAndWait(EXIT_TIMEOUT - 1, { clock, emitEvent })

    t.true(processExit.notCalled)

    clock.tick(1)
    t.true(processExit.called)

    stopLogging()

    unstubProcessExit({ clock, processExit })
  })

  test.serial(
    `should delay process.exit(1) with async opts.log() | ${name}`,
    // eslint-disable-next-line max-statements
    async t => {
      const { clock, processExit } = stubProcessExit()

      // eslint-disable-next-line fp/no-let, init-declarations
      let resolveA
      // eslint-disable-next-line promise/avoid-new
      const promise = new Promise(resolve => {
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

      await emitEventAndWait(EXIT_TIMEOUT, { clock, emitEvent })

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
