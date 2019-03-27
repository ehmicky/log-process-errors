'use strict'

const test = require('ava')

const { repeatEvents, normalizeCall } = require('./helpers')

const LOADERS = `${__dirname}/helpers/loaders/`

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
