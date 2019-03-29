'use strict'

const {
  env: { OPTIONS },
} = require('process')

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

// eslint-disable-next-line no-undef
describe('should make tests fail', () => {
  // eslint-disable-next-line no-undef
  it(`on ${name}`, () => {
    // eslint-disable-next-line no-empty-function, max-nested-callbacks
    EVENTS[name]().catch(() => {})
  })
})
