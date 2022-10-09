import normalizeException from 'normalize-exception'
import setErrorMessage from 'set-error-message'

// Normalize error and add the `event` to its `message`
export const getError = function (value, event) {
  const error = normalizeException(value)
  setErrorMessage(error, `${getMessage(error, event)}${MESSAGES[event]}`)
  return error
}

const getMessage = function ({ message }, event) {
  return event === 'rejectionHandled'
    ? message.replace(MESSAGES.unhandledRejection, '')
    : message
}

const MESSAGES = {
  uncaughtException: '\nThis exception was thrown but not caught.',
  unhandledRejection: '\nThis promise was rejected but not handled.',
  rejectionHandled: '\nThis promise was rejected and handled too late.',
  warning: '',
}
