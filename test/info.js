'use strict'

const test = require('ava')

const { EVENTS } = require('../helpers')

const { startLogging } = require('./helpers')

test('[uncaughtException] should set info properties', async t => {
  const { stopLogging, log } = startLogging({
    log: 'spy',
    eventName: 'uncaughtException',
  })

  const getError = () => true
  await EVENTS.uncaughtException(getError)

  t.is(log.callCount, 1)

  t.deepEqual(log.firstCall.args[2], {
    eventName: 'uncaughtException',
    error: true,
  })

  stopLogging()
})

test('[warning] should set info properties', async t => {
  const { stopLogging, log } = startLogging({
    log: 'spy',
    eventName: 'warning',
  })

  const warning = { message: 'message', code: '500', detail: 'Detail' }
  await EVENTS.warning(warning)

  t.is(log.callCount, 1)

  const {
    firstCall: {
      args: [, , info],
    },
  } = log
  t.deepEqual(
    { ...info, error: { ...info.error, message: info.error.message } },
    { eventName: 'warning', error: { ...warning, name: 'Warning' } },
  )
  t.true(info.error instanceof Error)

  stopLogging()
})

test('[unhandledRejection] should set info properties', async t => {
  const { stopLogging, log } = startLogging({
    log: 'spy',
    eventName: 'unhandledRejection',
  })

  const getError = () => true
  await EVENTS.unhandledRejection(getError)

  t.is(log.callCount, 1)

  t.deepEqual(log.firstCall.args[2], {
    eventName: 'unhandledRejection',
    promiseState: 'rejected',
    promiseValue: true,
  })

  stopLogging()
})

test('[rejectionHandled] should set info properties', async t => {
  const { stopLogging, log } = startLogging({
    log: 'spy',
    eventName: 'rejectionHandled',
  })

  const getError = () => true
  await EVENTS.rejectionHandled(getError)

  t.is(log.callCount, 1)

  t.deepEqual(log.firstCall.args[2], {
    eventName: 'rejectionHandled',
    promiseState: 'rejected',
    promiseValue: true,
  })

  stopLogging()
})

test('[multipleResolves] should set info properties', async t => {
  const { stopLogging, log } = startLogging({
    log: 'spy',
    eventName: 'multipleResolves',
  })

  await EVENTS.multipleResolves([
    ['resolve', () => true],
    ['reject', () => false],
  ])

  t.is(log.callCount, 1)

  t.deepEqual(log.firstCall.args[2], {
    eventName: 'multipleResolves',
    promiseState: 'resolved',
    promiseValue: true,
    secondPromiseState: 'rejected',
    secondPromiseValue: false,
  })

  stopLogging()
})
