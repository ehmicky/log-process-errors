'use strict'

const tap = require('tap')

const { EVENTS } = require('../emit')

const { callMain } = require('./main')

const name = callMain()

tap.test(`should make tests fail on ${name}`, t => {
  t.plan(1)
  // eslint-disable-next-line no-empty-function
  EVENTS[name]().catch(() => {})
  t.pass()
})
