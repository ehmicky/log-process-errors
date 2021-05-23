import tape from 'tape'

import { EVENTS_MAP } from '../../events/main.js'
import { getOptions } from '../options.js'

const { eventName } = getOptions()

tape.test(`should make tests fail on ${eventName}`, (t) => {
  t.plan(1)
  t.pass()
  // eslint-disable-next-line promise/prefer-await-to-then, no-empty-function
  EVENTS_MAP[eventName].emit().catch(() => {})
})
