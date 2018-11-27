'use strict'

const test = require('ava')
const execa = require('execa')

// eslint-disable-next-line import/no-internal-modules
const { getPackage } = require('../gulp/utils')

const { repeatEvents, normalizeMessage } = require('./helpers')

const STACK_REGISTER_FILE = './test/helpers/stack_register'
const EMIT_FILE = './test/helpers/emit'
const REGISTER_FILE = `${getPackage()}/register`

/* eslint-disable max-nested-callbacks */
repeatEvents((prefix, { eventName }) => {
  test(`${prefix} should work using the -r flag`, async t => {
    const { stdout, stderr, code } = await execa.shell(
      `node \
        --no-warnings \
        -r ${STACK_REGISTER_FILE} \
        -r ${REGISTER_FILE} \
        -e "require('${EMIT_FILE}').EVENTS.${eventName}()"`,
      { env: { LOG_PROCESS_ERRORS_TEST: '1' } },
    )

    const message = normalizeMessage(stderr)

    t.snapshot({ code, message, stdout })
  })
})
/* eslint-enable max-nested-callbacks */
