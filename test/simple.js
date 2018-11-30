'use strict'

const test = require('ava')
const execa = require('execa')

const { repeatEvents, normalizeMessage } = require('./helpers')

const LOADER_FILE = `${__dirname}/helpers/simple_loader`

/* eslint-disable max-nested-callbacks */
repeatEvents((prefix, { eventName }) => {
  test(`${prefix} should work using the -r flag`, async t => {
    const { stdout, stderr, code } = await execa.shell(
      `node --no-warnings ${LOADER_FILE} ${eventName}`,
      { env: { LOG_PROCESS_ERRORS_TEST: '1' } },
    )

    const message = normalizeMessage(stderr)

    t.snapshot({ code, message, stdout })
  })
})
/* eslint-enable max-nested-callbacks */
