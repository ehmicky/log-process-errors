import test from 'ava'
import { each } from 'test-each'

import { EVENTS } from './helpers/events/main.js'
import { normalizeCall } from './helpers/normalize.js'
import { removeProcessListeners } from './helpers/remove.js'

const LOADERS = `${__dirname}/helpers/loaders/`

removeProcessListeners()

each(EVENTS, ({ title }, { eventName }) => {
  test(`should work using the -r flag | ${title}`, async (t) => {
    t.snapshot(
      await normalizeCall(`node ${LOADERS}/register.js ${eventName}`, {
        colors: false,
      }),
    )
  })

  test(`should work using both the -r flag and init() | ${title}`, async (t) => {
    t.snapshot(await normalizeCall(`node ${LOADERS}/noop.js ${eventName}`))
  })
})
