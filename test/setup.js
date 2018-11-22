'use strict'

const process = require('process')

const test = require('ava')
const sinon = require('sinon')
const stripAnsi = require('strip-ansi')
const execa = require('execa')

const {
  repeatEvents,
  startLogging,
  startLoggingNoOpts,
  stubStackTrace,
  unstubStackTrace,
  normalizeMessage,
} = require('./helpers')

const addProcessHandler = function(eventName) {
  const processHandler = sinon.spy()
  process.on(eventName, processHandler)
  return processHandler
}

/* eslint-disable max-nested-callbacks */
repeatEvents((prefix, { eventName, emitEvent, defaultLevel }) => {
  test(`${prefix} should work using the -r flag`, async t => {
    const { stdout, stderr, code } = await execa.shell(
      `LOG_PROCESS_ERRORS_NO_EXIT=1 node \
        --no-warnings \
        -r ${__dirname}/helpers/stack_register \
        -r ${__dirname}/.. \
        -e "require('${__dirname}/helpers/emit').EVENTS.${eventName}()"`,
    )

    const message = normalizeMessage(stderr)

    t.snapshot({ message, stdout, code })
  })

  test(`${prefix} should work with no options`, async t => {
    stubStackTrace()
    // eslint-disable-next-line no-restricted-globals
    const stub = sinon.stub(console, defaultLevel)
    const { stopLogging } = startLoggingNoOpts()

    await emitEvent()

    const messages = stub.args.map(([arg]) => normalizeMessage(stripAnsi(arg)))

    stopLogging()
    stub.restore()
    unstubStackTrace()

    t.snapshot(messages)
  })

  test(`${prefix} should keep existing process event handlers`, async t => {
    const processHandler = addProcessHandler(eventName)

    const { stopLogging } = startLogging()

    t.true(processHandler.notCalled)

    await emitEvent()

    t.true(processHandler.called)

    stopLogging()

    process.off(eventName, processHandler)
  })

  test(`${prefix} should allow disabling logging`, async t => {
    const processHandler = addProcessHandler(eventName)

    const { stopLogging, log } = startLogging({ log: 'spy' })

    stopLogging()

    t.true(processHandler.notCalled)

    await emitEvent()

    t.true(processHandler.called)
    t.true(log.notCalled)

    stopLogging()

    process.off(eventName, processHandler)
  })
})
/* eslint-enable max-nested-callbacks */
