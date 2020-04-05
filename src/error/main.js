import { inspect } from 'util'

import { getMessage } from './message.js'
import { printError } from './print.js'
import { getStack } from './stack.js'

const { custom } = inspect

// Retrieve `error` which sums up all information that can be gathered about
// the event.
export const getError = function({ name, event }) {
  const message = getMessage({ event, name })
  const mainValue = getMainValue(event)
  const staticProps = getEventProps(mainValue)
  const stackA = getStack(mainValue)
  const error = buildError({ name, message, stack: stackA, staticProps })
  return { error, stack: stackA }
}

// Retrieve main thrown value, which is most likely an `Error` instance
const getMainValue = function({ value, nextValue: mainValue = value }) {
  return mainValue
}

// If event is an error, retrieve static properties except `name` and `message`
const getEventProps = function(mainValue) {
  if (mainValue instanceof Error) {
    return { ...mainValue }
  }

  return {}
}

const buildError = function({ name, message, stack, staticProps }) {
  const error = new Error(message)
  // eslint-disable-next-line fp/no-mutating-assign
  Object.assign(error, staticProps)
  // `error.name` should not be enumerable, to ensure it is correctly printed.
  // eslint-disable-next-line fp/no-mutating-methods
  Object.defineProperty(error, 'name', {
    value: capitalize(name),
    enumerable: false,
    writable: true,
    configurable: true,
  })
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
export const addErrorPrint = function({
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
