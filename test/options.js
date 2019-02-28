'use strict'

const test = require('ava')
const sinon = require('sinon')

const { startLogging, normalizeMessage } = require('./helpers')

const INVALID_OPTIONS = [
  { name: 'log', value: true },
  { name: 'level', value: true },
  { name: 'level', value: { warning: true } },
  { name: 'level', value: 'invalid' },
  { name: 'level', value: { warning: 'invalid' } },
  { name: 'message', value: true },
  { name: 'colors', value: 1 },
  { name: 'exitOn', value: true },
  { name: 'exitOn', value: ['invalid'] },
]

const WARNED_OPTIONS = [
  { name: 'unknown', value: true },
  { name: 'level', value: { unknown: 'error' } },
]

INVALID_OPTIONS.forEach(({ name, value }) => {
  test(`${JSON.stringify({ name, value })} should validate options`, t => {
    const error = t.throws(startLogging.bind(null, { [name]: value }))

    t.snapshot(normalizeJestValidate(error.message))
  })
})

WARNED_OPTIONS.forEach(({ name, value }) => {
  test(`${JSON.stringify({ name, value })} should warn on options`, t => {
    // eslint-disable-next-line no-restricted-globals
    const stub = sinon.stub(console, 'warn')

    const { stopLogging } = startLogging({ [name]: value })

    t.is(stub.callCount, 1)
    t.snapshot(normalizeMessage(stub.firstCall.args[0], { colors: false }))

    stopLogging()

    stub.restore()
  })
})

const normalizeJestValidate = function(message) {
  const messageA = normalizeMessage(message, { colors: false })
  // When using nyc, example function body adds dynamic instrumentation code
  const messageB = messageA.replace(FUNC_BODY_REGEXP, '$1$2')
  return messageB
}

const FUNC_BODY_REGEXP = /\s*(\(\)(?:=>)?\{)[^}]*(\})/gu
