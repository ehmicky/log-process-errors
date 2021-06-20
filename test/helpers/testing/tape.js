import { stubStackTrace } from '../stack.js'

stubStackTrace()

// eslint-disable-next-line import/first
import { boundLogProcessErrors } from './call.js'

boundLogProcessErrors()

// eslint-disable-next-line import/first, import/order
import tape from 'tape'

// eslint-disable-next-line import/first, import/order
import { EVENTS_MAP } from '../events/main.js'

// eslint-disable-next-line import/first
import { getOptions } from './options.js'

const { eventName } = getOptions()

tape.test(`should make tests fail on ${eventName}`, (t) => {
  t.plan(1)
  t.pass()
  // eslint-disable-next-line promise/prefer-await-to-then
  EVENTS_MAP[eventName].emit().catch(() => {})
})
