import process from 'process'
import { fileURLToPath } from 'url'

import test from 'ava'
import { execa } from 'execa'
import logProcessErrors from 'log-process-errors'
import sinon from 'sinon'
import { each } from 'test-each'

import { EVENTS, emit } from './helpers/events.js'
import { removeProcessListeners } from './helpers/remove.js'

const CLI_FIXTURE = fileURLToPath(new URL('helpers/cli.js', import.meta.url))

removeProcessListeners()

const setProcessEvent = function (eventName) {
  const processHandler = sinon.spy()
  process.on(eventName, processHandler)
  return processHandler
}

const unsetProcessEvent = function (eventName, processHandler) {
  process.off(eventName, processHandler)
}

const getConsoleStub = function () {
  // eslint-disable-next-line no-restricted-globals
  return sinon.stub(console, 'error')
}

const consoleStub = getConsoleStub()

test.serial('default event handlers should be enabled', async (t) => {
  await emit('warning')
  t.true(consoleStub.calledOnce)

  consoleStub.reset()
})

test.serial('default event handlers should be disabled', async (t) => {
  const stopLogging = logProcessErrors({ log() {} })

  await emit('warning')
  t.false(consoleStub.called)

  stopLogging()
  consoleStub.reset()
})

test.serial('default event handlers should be re-enabled', async (t) => {
  const stopLogging = logProcessErrors({ log() {} })
  stopLogging()
  await emit('warning')
  t.true(consoleStub.calledOnce)

  consoleStub.reset()
})

test.serial(
  'default event handlers should be re-enabled on multiple calls',
  async (t) => {
    const stopLoggingOne = logProcessErrors({ log() {} })
    const stopLoggingTwo = logProcessErrors({ log() {} })
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
  const stopLogging = logProcessErrors({ log() {} })

  await emit('warning')
  t.true(processHandler.calledOnce)

  stopLogging()
  unsetProcessEvent('warning', processHandler)
  consoleStub.reset()
})

const callCli = async function (eventName, cliFlag) {
  const { stdout } = await execa('node', [cliFlag, CLI_FIXTURE, eventName])
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
      t.is([...new Set(values)].length, 1)
    },
  )
})
