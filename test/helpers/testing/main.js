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

  const { name, register, ...options } = JSON.parse(OPTIONS)

  callRegister({ register, options })

  return name
}

const callRegister = function({ register, options, options: { testing } }) {
  if (register) {
    // eslint-disable-next-line import/no-dynamic-require
    require(`${REGISTER_DIR}/${testing}`)
    return
  }

  logProcessErrors(options)
}

module.exports = {
  callMain,
}
