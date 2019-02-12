'use strict'

const test = require('ava')
const execa = require('execa')

const { repeatEvents, normalizeMessage } = require('./helpers')

const SIMPLE_LOADER_FILE = `${__dirname}/helpers/simple_loader`
const NOOP_LOADER_FILE = `${__dirname}/helpers/noop_loader`

/* eslint-disable max-nested-callbacks */
repeatEvents((prefix, { eventName }) => {
  test(`${prefix} should work using the -r flag`, async t => {
    const { stdout, stderr, code } = await execa.shell(
      `node ${SIMPLE_LOADER_FILE} ${eventName}`,
      { env: { LOG_PROCESS_ERRORS_TEST: '1' } },
    )

    const message = normalizeMessage(stderr)

    t.snapshot({ code, message, stdout })
  })

  test(`${prefix} should work with --no-warnings`, async t => {
    const { stdout, stderr, code } = await execa.shell(
      `node --no-warnings ${SIMPLE_LOADER_FILE} ${eventName}`,
      { env: { LOG_PROCESS_ERRORS_TEST: '1' } },
    )

    const message = normalizeMessage(stderr)

    t.snapshot({ code, message, stdout })
  })

  test(`${prefix} should work using both the -r flag and init()`, async t => {
    const { stdout, stderr, code } = await execa.shell(
      `node --no-warnings ${NOOP_LOADER_FILE} ${eventName}`,
      {
        env: { LOG_PROCESS_ERRORS_TEST: '1' },
      },
    )

    t.snapshot({ code, stdout, stderr })
  })
})
/* eslint-enable max-nested-callbacks */
