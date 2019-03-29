// eslint-disable-next-line ava/no-ignored-test-files
'use strict'

const test = require('ava')

const { EVENTS } = require('../emit')

const { callMain } = require('./main')

const name = callMain()

test(`should make tests fail on ${name}`, t => {
  // eslint-disable-next-line no-empty-function
  EVENTS[name]().catch(() => {})
  t.pass()
})
