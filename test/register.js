import test from 'ava'
import testEach from 'test-each'

import { EVENT_DATA } from './helpers/repeat.js'
import { normalizeCall } from './helpers/normalize.js'
import { removeProcessListeners } from './helpers/remove.js'

const LOADERS = `${__dirname}/helpers/loaders/`

removeProcessListeners()

testEach(EVENT_DATA, ({ name }, { eventName }) => {
  test(`should work using the -r flag | ${name}`, async t => {
    const returnValue = await normalizeCall(
      `node ${LOADERS}/register.js ${eventName}`,
    )

    t.snapshot(returnValue)
  })

  test(`should work with --no-warnings | ${name}`, async t => {
    const returnValue = await normalizeCall(
      `node --no-warnings ${LOADERS}/simple.js ${eventName}`,
    )

    t.snapshot(returnValue)
  })

  test(`should work using both the -r flag and init() | ${name}`, async t => {
    const returnValue = await normalizeCall(
      `node ${LOADERS}/noop.js ${eventName}`,
    )

    t.snapshot(returnValue)
  })
})
