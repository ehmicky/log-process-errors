'use strict'

const test = require('ava')
const execa = require('execa')

const { repeatEvents, normalizeMessage } = require('./helpers')

/* eslint-disable max-nested-callbacks */
repeatEvents((prefix, { eventName }) => {
  test(`${prefix} should work using the -r flag`, async t => {
    const returnValue = await callLoader({ eventName, loader: 'simple' })

    t.snapshot(returnValue)
  })

  test(`${prefix} should work with --no-warnings`, async t => {
    const returnValue = await callLoader({
      eventName,
      loader: 'simple',
      flags: '--no-warnings',
    })

    t.snapshot(returnValue)
  })

  test(`${prefix} should work using both the -r flag and init()`, async t => {
    const returnValue = await callLoader({
      eventName,
      loader: 'noop',
      flags: '--no-warnings',
    })

    t.snapshot(returnValue)
  })
})
/* eslint-enable max-nested-callbacks */

const callLoader = async function({ eventName, loader, flags = '' }) {
  const { stdout, stderr, code } = await execa.shell(
    `node ${flags} ${LOADERS[loader]} ${eventName}`,
    { env: { LOG_PROCESS_ERRORS_TEST: '1' } },
  )

  const message = normalizeMessage(stderr)

  return { code, message, stdout }
}

const LOADERS = {
  simple: `${__dirname}/helpers/simple_loader`,
  noop: `${__dirname}/helpers/noop_loader`,
}
