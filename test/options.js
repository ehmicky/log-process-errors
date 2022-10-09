import test from 'ava'
import logProcessErrors from 'log-process-errors'
import { each } from 'test-each'

import { removeProcessListeners } from './helpers/remove.js'

removeProcessListeners()

each(
  [true, { exit: 'true' }, { log: true }, { unknown: true }],
  ({ title }, options) => {
    test(`should validate options | ${title}`, (t) => {
      t.throws(logProcessErrors.bind(undefined, options))
    })
  },
)
