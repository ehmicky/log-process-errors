'use strict'

// Retrieve `message` which sums up all information that can be gathered about
// the event.
const getMessage = function({ eventName, promiseState, promiseValue, error }) {
  const mainMessage = MAIN_MESSAGES[eventName]
  const warningMessage = getWarningMessage({ eventName, error })
  const promiseMessage = getPromiseMessage({ promiseState, promiseValue })

  const message = [mainMessage, warningMessage, promiseMessage, error]
    .filter(part => part !== undefined)
    .join('\n')
  return message
}

// First line of `message`
const MAIN_MESSAGES = {
  uncaughtException: 'Uncaught exception:',
  warning: 'Warning:',
  unhandledRejection: 'A promise was rejected but not handled:',
  rejectionHandled: 'A promise was handled after being already rejected:',
  multipleResolves: 'A promise was resolved/rejected multiple times:',
}

// `warning` events use `Error.name|code|detail` in `message`
const getWarningMessage = function({
  eventName,
  error: { name, code, detail } = {},
}) {
  if (eventName !== 'warning') {
    return
  }

  const codeMessage = code === undefined ? '' : ` (${code})`
  const detailMessage = detail === undefined ? '' : ` ${detail}`
  const warningMessage = `${name}${codeMessage}${detailMessage}`
  return warningMessage
}

// `unhandledRejection`, `rejectionHandled` and `multipleResolves` events show
// the promise's resolved/rejected state and value in `message`
const getPromiseMessage = function({ promiseState, promiseValue }) {
  if (promiseState === undefined) {
    return
  }

  const value = promiseValue instanceof Error ? 'an error' : promiseValue
  return `Promise was ${promiseState} with ${value}`
}

module.exports = {
  getMessage,
}
