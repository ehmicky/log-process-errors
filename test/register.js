import test from 'ava'

import { repeatEvents } from './helpers/repeat.js'
import { normalizeCall } from './helpers/normalize.js'
import { removeProcessListeners } from './helpers/remove.js'

const LOADERS = `${__dirname}/helpers/loaders/`

removeProcessListeners()

repeatEvents((prefix, { name }) => {
  test(`${prefix} should work using the -r flag`, async t => {
    const returnValue = await normalizeCall(
      `node ${LOADERS}/register.js ${name}`,
    )

    t.snapshot(returnValue)
  })

  test(`${prefix} should work with --no-warnings`, async t => {
    const returnValue = await normalizeCall(
      `node --no-warnings ${LOADERS}/simple.js ${name}`,
    )

    t.snapshot(returnValue)
  })

  test(`${prefix} should work using both the -r flag and init()`, async t => {
    const returnValue = await normalizeCall(`node ${LOADERS}/noop.js ${name}`)

    t.snapshot(returnValue)
  })
})
