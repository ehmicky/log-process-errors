import tape from 'tape'

import { EVENTS } from '../../emit/main.js'
import { getOptions } from '../options.js'

const { name } = getOptions()

tape.test(`should make tests fail on ${name}`, t => {
  t.plan(1)
  t.pass()
  // eslint-disable-next-line no-empty-function
  EVENTS[name]().catch(() => {})
})
