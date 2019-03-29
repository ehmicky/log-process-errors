'use strict'

const {
  env: { OPTIONS },
} = require('process')

const logProcessErrors = require('../../../src')
const { stubStackTrace } = require('../stack')

const REGISTER_DIR = `${__dirname}/../../../../register`

// Call `log-process-errors` with the options passed as environment variable
// `OPTIONS`. Also mock stack traces.
const callMain = function() {
  stubStackTrace()

  const { name, message, testing, register, ...options } = JSON.parse(OPTIONS)
  // Functions cannot be serialized in JSON
  const messageA = message === undefined ? message : () => message

  callRegister({ register, testing, message: messageA, options })

  return name
}

const callRegister = function({ register, testing, message, options }) {
  if (register) {
    // eslint-disable-next-line import/no-dynamic-require
    require(`${REGISTER_DIR}/${testing}`)
    return
  }

  logProcessErrors({ ...options, testing, message })
}

module.exports = {
  callMain,
}
