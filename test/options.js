import test from 'ava'
import { each } from 'test-each'

import { startLogging } from './helpers/init.js'
import { removeProcessListeners } from './helpers/remove.js'

removeProcessListeners()

each(
  [{ log: true }, { exitOn: true }, { exitOn: ['invalid'] }],
  ({ title }, options) => {
    test(`should validate options | ${title}`, (t) => {
      const error = t.throws(startLogging.bind(undefined, options))
      t.snapshot(error.message)
    })
  },
)
