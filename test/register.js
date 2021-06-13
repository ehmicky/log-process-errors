import { fileURLToPath } from 'url'

import test from 'ava'
import { each } from 'test-each'

import { EVENTS } from './helpers/events/main.js'
import { hasOldExitBehavior } from './helpers/events/version.js'
import { normalizeCall } from './helpers/normalize.js'
import { removeProcessListeners } from './helpers/remove.js'

const LOADERS = fileURLToPath(new URL('./helpers/loaders/', import.meta.url))

removeProcessListeners()

each(EVENTS, ({ title }, { eventName }) => {
  test(`should work using register | ${title}`, async (t) => {
    if (hasOldExitBehavior(eventName)) {
      t.pass()
      return
    }

    t.snapshot(
      await normalizeCall(`node ${LOADERS}/register.js ${eventName}`, {
        colors: false,
      }),
    )
  })

  test(`should work using both register and init() | ${title}`, async (t) => {
    t.snapshot(await normalizeCall(`node ${LOADERS}/noop.js ${eventName}`))
  })
})
