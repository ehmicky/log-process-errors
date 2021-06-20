// eslint-disable-next-line import/no-unassigned-import, import/order
import './stack.js'
// eslint-disable-next-line import/order
import { boundLogProcessErrors } from './call.js'

boundLogProcessErrors()

// eslint-disable-next-line import/first
import tape from 'tape'

// eslint-disable-next-line import/first
import { EVENTS_MAP } from '../events/main.js'

// eslint-disable-next-line import/first
import { getOptions } from './options.js'

const { eventName } = getOptions()

tape.test(`should make tests fail on ${eventName}`, (t) => {
  t.plan(1)
  t.pass()
  // eslint-disable-next-line promise/prefer-await-to-then, no-empty-function
  EVENTS_MAP[eventName].emit().catch(() => {})
})
