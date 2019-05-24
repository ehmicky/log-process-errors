import test from 'ava'

import { repeat } from './helpers/data_driven/main.js'
import { EVENT_DATA } from './helpers/repeat.js'
import { normalizeCall } from './helpers/normalize.js'
import { removeProcessListeners } from './helpers/remove.js'

const LOADERS = `${__dirname}/helpers/loaders/`

removeProcessListeners()

repeat(EVENT_DATA, ({ name }, { eventName }) => {
  test(`${name} should work using the -r flag`, async t => {
    const returnValue = await normalizeCall(
      `node ${LOADERS}/register.js ${eventName}`,
    )

    t.snapshot(returnValue)
  })

  test(`${name} should work with --no-warnings`, async t => {
    const returnValue = await normalizeCall(
      `node --no-warnings ${LOADERS}/simple.js ${eventName}`,
    )

    t.snapshot(returnValue)
  })

  test(`${name} should work using both the -r flag and init()`, async t => {
    const returnValue = await normalizeCall(
      `node ${LOADERS}/noop.js ${eventName}`,
    )

    t.snapshot(returnValue)
  })
})
