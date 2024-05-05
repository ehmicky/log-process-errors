import { fileURLToPath } from 'node:url'

import test from 'ava'
import { execaNode } from 'execa'
import { each } from 'test-each'

import { getConsoleStub } from './helpers/console.test.js'
import { EVENTS, emit } from './helpers/events.test.js'
import { setProcessEvent, unsetProcessEvent } from './helpers/process.test.js'
import { removeProcessListeners } from './helpers/remove.test.js'
import { startLogging } from './helpers/start.test.js'

const CLI_FIXTURE = fileURLToPath(
  new URL('helpers/cli.test.js', import.meta.url),
)

const consoleStub = getConsoleStub()

test.serial('default event handlers should be enabled', async (t) => {
  await emit('warning')
  t.true(consoleStub.calledOnce)

  consoleStub.reset()
})

test.serial('default event handlers should be disabled', async (t) => {
  const { stopLogging } = startLogging()

  await emit('warning')
  t.false(consoleStub.called)

  stopLogging()
  consoleStub.reset()
})

test.serial('default event handlers should be re-enabled', async (t) => {
  const { stopLogging } = startLogging()
  stopLogging()
  await emit('warning')
  t.true(consoleStub.calledOnce)

  consoleStub.reset()
})

test.serial(
  'default event handlers should be re-enabled on multiple calls',
  async (t) => {
    const { stopLogging: stopLoggingOne } = startLogging()
    const { stopLogging: stopLoggingTwo } = startLogging()
    stopLoggingTwo()
    await emit('warning')
    t.false(consoleStub.called)
    stopLoggingOne()
    await emit('warning')
    t.true(consoleStub.calledOnce)

    consoleStub.reset()
  },
)

test.serial('user event handlers should be kept', async (t) => {
  const processHandler = setProcessEvent('warning')
  const { stopLogging } = startLogging()

  await emit('warning')
  t.true(processHandler.calledOnce)

  stopLogging()
  unsetProcessEvent('warning', processHandler)
  consoleStub.reset()
})

const callCli = async (eventName, cliFlag) => {
  const { stdout } = await execaNode(cliFlag, [CLI_FIXTURE, eventName])
  return stdout
}

each(EVENTS, ({ title }, eventName) => {
  test.serial(
    `should work with warnings-related CLI flags | ${title}`,
    async (t) => {
      const values = await Promise.all(
        [
          '--',
          '--no-warnings',
          '--unhandled-rejections=none',
          '--unhandled-rejections=throw',
          '--unhandled-rejections=strict',
        ].map(callCli.bind(undefined, eventName)),
      )
      t.is(new Set(values).size, 1)
    },
  )
})

removeProcessListeners()
