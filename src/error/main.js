import { getMessage } from './message.js'

// Retrieve `error` which sums up all information that can be gathered about
// the event.
export const getError = function (value, isError, reason) {
  const message = getMessage(value, isError, reason)
  const staticProps = getEventProps(value, isError)
  const stack = getStack(value, isError)
  const error = buildError({ reason, message, stack, staticProps })
  return error
}

// If event is an error, retrieve static properties except `name` and `message`
const getEventProps = function (value, isError) {
  return isError ? { ...value } : {}
}

// Retrieve `error.stack` by re-using the original error's stack trace
// Remove first line of `Error.stack` as it contains `Error.name|message`,
// which is already present in the upper error's `message`
const getStack = function (value, isError) {
  return isError ? value.stack.replace(FIRST_LINE_REGEXP, '') : ''
}

const FIRST_LINE_REGEXP = /.*\n/u

const buildError = function ({ reason, message, stack, staticProps }) {
  const error = new Error(message)
  // eslint-disable-next-line fp/no-mutating-assign
  Object.assign(error, staticProps)
  // `error.name` should not be enumerable, to ensure it is correctly printed.
  // eslint-disable-next-line fp/no-mutating-methods
  Object.defineProperty(error, 'name', {
    value: capitalize(reason),
    enumerable: false,
    writable: true,
    configurable: true,
  })
  // We removed the first line of `stack`, now we substitute it
  error.stack = `${error}\n${stack}`
  return error
}

const capitalize = function (string) {
  const [firstLetter, ...rest] = string
  return [firstLetter.toUpperCase(), ...rest].join('')
}
