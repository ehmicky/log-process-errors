import test from 'ava'
import sinon from 'sinon'
import { each } from 'test-each'

import { startLogging } from '../helpers/init.js'
import { normalizeMessage } from '../helpers/normalize.js'
import { removeProcessListeners } from '../helpers/remove.js'

removeProcessListeners()

const normalizeJestValidate = function (message) {
  const messageA = normalizeMessage(message, { colors: false })
  const messageB = messageA.replace(EXAMPLE_REGEXP, '')
  return messageB
}

// Examples show default options values which might vary
const EXAMPLE_REGEXP = /Example:[^]*/u

each(
  [
    { log: true },
    { level: true },
    { level: { warning: true } },
    { level: 'invalid' },
    { level: { warning: 'invalid' } },
    { colors: 1 },
    { exitOn: true },
    { exitOn: ['invalid'] },
  ],
  ({ title }, options) => {
    test(`should validate options | ${title}`, (t) => {
      const error = t.throws(startLogging.bind(undefined, options))

      t.snapshot(normalizeJestValidate(error.message))
    })
  },
)

each(
  [{ unknown: true }, { level: { unknown: 'error' } }],
  ({ title }, options) => {
    test(`should warn on options | ${title}`, (t) => {
      // eslint-disable-next-line no-restricted-globals
      const stub = sinon.stub(console, 'warn')

      const { stopLogging } = startLogging(options)
      stopLogging()

      t.is(stub.callCount, 1)
      t.snapshot(normalizeMessage(stub.firstCall.args[0], { colors: false }))

      stub.restore()
    })
  },
)
