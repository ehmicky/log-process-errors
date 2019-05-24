import test from 'ava'
import testEach from 'test-each'
import sinon from 'sinon'

import { startLogging } from '../helpers/init.js'
import { normalizeMessage } from '../helpers/normalize.js'
import { removeProcessListeners } from '../helpers/remove.js'

removeProcessListeners()

const normalizeJestValidate = function(message) {
  const messageA = normalizeMessage(message, { colors: false })
  // When using nyc, example function body adds dynamic instrumentation code
  const messageB = messageA.replace(FUNC_BODY_REGEXP, '$1$2')
  return messageB
}

const FUNC_BODY_REGEXP = /\s*(\(\)(?:=>)?\{)[^}]*(\})/gu

testEach([
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
], ({ name }, options) => {
  test(`should validate options | ${name}`, t => {
    const error = t.throws(startLogging.bind(null, options))

    t.snapshot(normalizeJestValidate(error.message))
  })
})

testEach([
  { unknown: true },
  { level: { unknown: 'error' } },
], ({ name }, options) => {
  test(`should warn on options | ${name}`, t => {
    // eslint-disable-next-line no-restricted-globals
    const stub = sinon.stub(console, 'warn')

    const { stopLogging } = startLogging(options)
    stopLogging()

    t.is(stub.callCount, 1)
    t.snapshot(normalizeMessage(stub.firstCall.args[0], { colors: false }))

    stub.restore()
  })
})
