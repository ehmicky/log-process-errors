'use strict'

const tape = require('tape')

const { EVENTS } = require('../emit')

const { callMain } = require('./main')

const name = callMain()

tape.test(`should make tests fail on ${name}`, t => {
  t.plan(1)
  t.pass()
  // eslint-disable-next-line no-empty-function
  EVENTS[name]().catch(() => {})
})
