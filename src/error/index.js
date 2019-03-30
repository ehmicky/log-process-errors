'use strict'

const {
  inspect: { custom },
} = require('util')

const { getMessage } = require('./message')
const { getStack } = require('./stack')
const { printError } = require('./print')

// Retrieve `error` which sums up all information that can be gathered about
// the event.
const getError = function({ opts, level, event: { name, ...event } }) {
  const message = getMessage({ event, name })
  const stack = getStack({ event })
  const error = buildError({ opts, level, name, message, stack })
  return error
}

const buildError = function({ opts, level, name, message, stack }) {
  const error = new Error(message)
  // eslint-disable-next-line fp/no-mutation
  error.name = capitalize(name)
  // We removed the first line of `stack`, now we substitute it
  // eslint-disable-next-line fp/no-mutation
  error.stack = `${error}\n${stack}`
  // eslint-disable-next-line fp/no-mutation
  error[custom] = printError.bind(null, { opts, level, name, error, stack })
  return error
}

const capitalize = function(string) {
  const [firstLetter, ...rest] = string
  return [firstLetter.toUpperCase(), ...rest].join('')
}

module.exports = {
  getError,
}
