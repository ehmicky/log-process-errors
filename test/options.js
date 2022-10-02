import test from 'ava'
import sinon from 'sinon'
import { each } from 'test-each'

import { startLogging } from './helpers/init.js'
import { normalizeMessage } from './helpers/normalize.js'
import { removeProcessListeners } from './helpers/remove.js'

removeProcessListeners()

const normalizeJestValidate = function (message) {
  const messageA = normalizeMessage(message)
  const messageB = messageA.replace(EXAMPLE_REGEXP, '')
  return messageB
}

// Examples show default options values which might vary
const EXAMPLE_REGEXP = /Example:[^]*/u

each(
  [{ log: true }, { exitOn: true }, { exitOn: ['invalid'] }],
  ({ title }, options) => {
    test(`should validate options | ${title}`, (t) => {
      const error = t.throws(startLogging.bind(undefined, options))

      t.snapshot(normalizeJestValidate(error.message))
    })
  },
)

test('should warn on options', (t) => {
  // eslint-disable-next-line no-restricted-globals
  const stub = sinon.stub(console, 'warn')

  const { stopLogging } = startLogging({ unknown: true })
  stopLogging()

  t.is(stub.callCount, 1)
  t.snapshot(normalizeMessage(stub.firstCall.args[0]))

  stub.restore()
})
