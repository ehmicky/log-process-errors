'use strict'

const process = require('process')

const test = require('ava')
const sinon = require('sinon')

const logProcessErrors = require('../src')
const EVENTS = require('../helpers')

// Ava sets up process `uncaughtException` and `unhandledRejection` handlers
// which makes testing them harder.
const removeProcessListeners = function() {
  Object.keys(EVENTS).forEach(eventName =>
    process.removeAllListeners(eventName),
  )
}

removeProcessListeners()

const startLogging = function(opts) {
  // eslint-disable-next-line no-empty-function
  return logProcessErrors({ exitOn: [], log() {}, ...opts })
}

const startLoggingEvent = function(eventName, opts) {
  const skipEvent = onlyEvent.bind(null, eventName)
  return startLogging({ ...opts, skipEvent })
}

const onlyEvent = function(eventName, info) {
  return info.eventName !== eventName
}

/* eslint-disable max-nested-callbacks */
Object.entries(EVENTS)
  .filter(([eventName]) => eventName !== 'all')
  .forEach(([eventName, emitEvent]) => {
    test(`[${eventName}] events emitters should exist`, t => {
      t.is(typeof emitEvent, 'function')
    })

    test(`[${eventName}] events emitters should not throw`, async t => {
      const stopLogging = startLogging()

      await t.notThrowsAsync(emitEvent)

      stopLogging()
    })

    test(`[${eventName}] should fire opts.log()`, async t => {
      const spy = sinon.spy()

      const stopLogging = startLogging({ log: spy })

      await emitEvent()

      t.true(spy.called)

      stopLogging()
    })

    test(`[${eventName}] should fire opts.log() once`, async t => {
      const spy = sinon.spy()

      const stopLogging = startLoggingEvent(eventName, { log: spy })

      await emitEvent()

      t.true(spy.calledOnce)

      stopLogging()
    })
  })
/* eslint-enable max-nested-callbacks */
