'use strict'

const {
  env: { OPTIONS },
} = require('process')

const tap = require('tap')

const logProcessErrors = require('../../../src')
const { EVENTS } = require('../emit')
const { stubStackTrace } = require('../stack')

stubStackTrace()

const { name, message, testing, ...options } = JSON.parse(OPTIONS)
// Functions cannot be serialized in JSON
const messageA = message === undefined ? message : () => message

if (options.register) {
  // eslint-disable-next-line import/no-dynamic-require
  require(`${__dirname}/../../../../register/${testing}`)
} else {
  logProcessErrors({ ...options, testing, message: messageA })
}

tap.test(`should make tests fail on ${name}`, t => {
  t.plan(1)
  // eslint-disable-next-line no-empty-function
  EVENTS[name]().catch(() => {})
  t.pass()
})
