import tap from 'tap'

import { EVENTS } from '../../emit/main.js'
import { getOptions } from '../options.js'
// Needs to be required after `tap` because it stubs stack traces too.
// eslint-disable-next-line import/no-unassigned-import
import '../stack.js'

const { name } = getOptions()

tap.test(`should make tests fail on ${name}`, t => {
  t.plan(1)
  // eslint-disable-next-line no-empty-function
  EVENTS[name]().catch(() => {})
  t.pass()
})
