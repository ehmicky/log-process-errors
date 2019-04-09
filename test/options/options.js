import test from 'ava'
import sinon from 'sinon'

import { startLogging } from '../helpers/init.js'
import { normalizeMessage } from '../helpers/normalize.js'
import { removeProcessListeners } from '../helpers/remove.js'

removeProcessListeners()

const INVALID_OPTIONS = [
  { log: true },
  { level: true },
  { level: { warning: true } },
  { level: 'invalid' },
  { level: { warning: 'invalid' } },
  { colors: 1 },
  { exitOn: true },
  { exitOn: ['invalid'] },
  { testing: true },
  { testing: 'invalid' },
  // eslint-disable-next-line no-empty-function
  { testing: 'ava', log() {} },
]

const WARNED_OPTIONS = [{ unknown: true }, { level: { unknown: 'error' } }]

INVALID_OPTIONS.forEach(options => {
  test(`${JSON.stringify(options)} should validate options`, t => {
    const error = t.throws(startLogging.bind(null, options))

    t.snapshot(normalizeJestValidate(error.message))
  })
})

WARNED_OPTIONS.forEach(options => {
  test(`${JSON.stringify(options)} should warn on options`, t => {
    // eslint-disable-next-line no-restricted-globals
    const stub = sinon.stub(console, 'warn')

    const { stopLogging } = startLogging(options)
    stopLogging()

    t.is(stub.callCount, 1)
    t.snapshot(normalizeMessage(stub.firstCall.args[0], { colors: false }))

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
