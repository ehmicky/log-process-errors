'use strict'

const test = require('ava')

const { repeatEvents, normalizeCall } = require('./helpers')

const SIMPLE_LOADER = `${__dirname}/helpers/simple_loader`
const NOOP_LOADER = `${__dirname}/helpers/noop_loader`

repeatEvents((prefix, { name }) => {
  test(`${prefix} should work using the -r flag`, async t => {
    const returnValue = await normalizeCall('node', [SIMPLE_LOADER, name])

    t.snapshot(returnValue)
  })

  test(`${prefix} should work with --no-warnings`, async t => {
    const returnValue = await normalizeCall('node', [
      '--no-warnings',
      SIMPLE_LOADER,
      name,
    ])

    t.snapshot(returnValue)
  })

  test(`${prefix} should work using both the -r flag and init()`, async t => {
    const returnValue = await normalizeCall('node', [NOOP_LOADER, name])

    t.snapshot(returnValue)
  })
})
