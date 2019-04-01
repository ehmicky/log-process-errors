'use strict'

const {
  inspect: { custom },
} = require('util')

const { getMessage } = require('./message')
const { getStack } = require('./stack')
const { printError } = require('./print')

// Retrieve `error` which sums up all information that can be gathered about
// the event.
const getError = function({ name, event }) {
  const message = getMessage({ event, name })
  const stack = getStack({ event })
  const error = buildError({ name, message, stack })
  return { error, stack }
}

const buildError = function({ name, message, stack }) {
  const error = new Error(message)
  // eslint-disable-next-line fp/no-mutation
  error.name = capitalize(name)
  // We removed the first line of `stack`, now we substitute it
  // eslint-disable-next-line fp/no-mutation
  error.stack = `${error}\n${stack}`
  return error
}

const capitalize = function(string) {
  const [firstLetter, ...rest] = string
  return [firstLetter.toUpperCase(), ...rest].join('')
}

// This needs to be done later because `error` is used by `level`
const addErrorPrint = function({
  error,
  error: { message },
  opts,
  level,
  name,
  stack,
}) {
  // eslint-disable-next-line fp/no-mutation, no-param-reassign
  error[custom] = printError.bind(null, { opts, level, name, message, stack })
}

module.exports = {
  getError,
  addErrorPrint,
}
