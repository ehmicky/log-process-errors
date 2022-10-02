import normalizeException from 'normalize-exception'
import setErrorMessage from 'set-error-message'

// Normalize error and add the `reason` to its `message`
export const getError = function (value, reason) {
  const error = normalizeException(value)
  setErrorMessage(error, `${getMessage(error, reason)}${MESSAGES[reason]}`)
  return error
}

const getMessage = function ({ message }, reason) {
  return reason === 'rejectionHandled'
    ? message.replace(MESSAGES.unhandledRejection, '')
    : message
}

const MESSAGES = {
  uncaughtException: '\nThis exception was thrown but not caught.',
  unhandledRejection: '\nThis promise was rejected but not handled.',
  rejectionHandled: '\nThis promise was rejected and handled too late.',
  warning: '',
}
