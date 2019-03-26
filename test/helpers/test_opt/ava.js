// eslint-disable-next-line ava/no-ignored-test-files
'use strict'

const {
  env: { EVENT_NAME },
} = require('process')

const test = require('ava')

const logProcessErrors = require('../../../src')
const { EVENTS } = require('../emit')
const { stubStackTrace } = require('../stack')

stubStackTrace()

logProcessErrors({ test: 'ava' })

test(`should make tests fail on ${EVENT_NAME}`, async t => {
  await EVENTS[EVENT_NAME]()
  t.pass()
})
