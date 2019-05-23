import tape from 'tape'

import { EVENTS } from '../../emit/main.js'
import { getOptions } from '../options.js'

const { eventName } = getOptions()

tape.test(`should make tests fail on ${eventName}`, t => {
  t.plan(1)
  t.pass()
  // eslint-disable-next-line no-empty-function
  EVENTS[eventName]().catch(() => {})
})
