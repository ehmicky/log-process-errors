import test from 'ava'
import logProcessErrors from 'log-process-errors'
import { each } from 'test-each'

import { removeProcessListeners } from './helpers/remove.js'

each(
  [true, { exit: 'true' }, { onError: true }, { unknown: true }],
  ({ title }, options) => {
    test.serial(`should validate options | ${title}`, (t) => {
      t.throws(logProcessErrors.bind(undefined, options))
    })
  },
)

removeProcessListeners()
