// eslint-disable-next-line import/order
import { boundLogProcessErrors } from './call.js'

boundLogProcessErrors()

// eslint-disable-next-line import/first
import tap from 'tap'

// eslint-disable-next-line import/first
import { EVENTS_MAP } from '../events/main.js'

// eslint-disable-next-line import/order, import/first
import { getOptions } from './options.js'

// Needs to be required after `tap` because it stubs stack traces too.
// eslint-disable-next-line import/no-unassigned-import, import/first
import '../stack.js'

const { eventName } = getOptions()

tap.test(`should make tests fail on ${eventName}`, (t) => {
  t.plan(1)
  // eslint-disable-next-line promise/prefer-await-to-then, no-empty-function
  EVENTS_MAP[eventName].emit().catch(() => {})
  t.pass()
})
