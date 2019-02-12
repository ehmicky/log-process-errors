'use strict'

const test = require('ava')
const sinon = require('sinon')

const {
  startLogging,
  stubStackTrace,
  unstubStackTrace,
  normalizeMessage,
  EVENTS: { warning: emitWarning },
} = require('./helpers')

test('[warning] should disable default event handlers', async t => {
  stubStackTrace()

  // eslint-disable-next-line no-restricted-globals
  const stub = sinon.stub(console, 'error')

  const { stopLogging, log } = startLogging({ log: 'spy' })

  await emitWarning()

  t.true(log.calledOnce)
  t.snapshot(normalizeMessage(log.lastCall.args[0]))

  t.true(stub.notCalled)

  stopLogging()

  stub.restore()

  unstubStackTrace()
})

test('[warning] should restore default event handlers', async t => {
  // eslint-disable-next-line no-restricted-globals
  const stub = sinon.stub(console, 'error')

  const { stopLogging } = startLogging()
  stopLogging()

  await emitWarning()

  t.true(stub.calledOnce)
  t.snapshot(normalizeMessage(stub.lastCall.args[0]))

  stub.restore()
})

test('[warning] should multiply restore default event handlers', async t => {
  // eslint-disable-next-line no-restricted-globals
  const stub = sinon.stub(console, 'error')

  const { stopLogging } = startLogging()
  startLogging().stopLogging()

  await emitWarning()

  t.true(stub.notCalled)

  stopLogging()

  await emitWarning()

  t.true(stub.calledOnce)
  t.snapshot(normalizeMessage(stub.lastCall.args[0]))

  stub.restore()
})
