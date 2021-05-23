import tap from 'tap'

import { EVENTS_MAP } from '../../events/main.js'
import { getOptions } from '../options.js'
// Needs to be required after `tap` because it stubs stack traces too.
// eslint-disable-next-line import/no-unassigned-import
import '../stack.js'

const { eventName } = getOptions()

tap.test(`should make tests fail on ${eventName}`, (t) => {
  t.plan(1)
  // eslint-disable-next-line promise/prefer-await-to-then, no-empty-function
  EVENTS_MAP[eventName].emit().catch(() => {})
  t.pass()
})
