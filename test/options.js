import test from 'ava'
import logProcessErrors, { validateOptions } from 'log-process-errors'
import { each } from 'test-each'

import { removeProcessListeners } from './helpers/remove.js'

each(
  [logProcessErrors, validateOptions],
  [true, { exit: 'true' }, { onError: true }, { unknown: true }],
  ({ title }, validate, options) => {
    test.serial(`should validate options | ${title}`, (t) => {
      t.throws(validate.bind(undefined, options))
    })
  },
)

removeProcessListeners()
