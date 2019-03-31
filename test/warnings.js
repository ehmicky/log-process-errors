'use strict'

const test = require('ava')
const sinon = require('sinon')

const {
  startLogging,
  normalizeMessage,
  EVENTS: { warning: emitWarning },
} = require('./helpers')

test('[warning] should disable default event handlers', async t => {
  // eslint-disable-next-line no-restricted-globals
  const stub = sinon.stub(console, 'error')

  const { stopLogging, log } = startLogging({ log: 'spy', colors: false })

  await emitWarning()

  t.true(log.calledOnce)
  t.snapshot(String(log.lastCall.args[0]))

  t.true(stub.notCalled)

  stopLogging()

  stub.restore()
})

test('[warning] should restore default event handlers', async t => {
  // eslint-disable-next-line no-restricted-globals
  const stub = sinon.stub(console, 'error')

  const { stopLogging } = startLogging()
  stopLogging()

  await emitWarning()

  t.true(stub.calledOnce)
  const message = normalizeMessage(String(stub.lastCall.args[0]))
  t.snapshot(message)

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
  t.snapshot(normalizeMessage(String(stub.lastCall.args[0])))

  stub.restore()
})
