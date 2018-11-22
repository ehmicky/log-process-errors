'use strict'

const defaultGetError = function() {
  return new Error('message')
}

const defaultGetSuccess = function() {
  return { success: true }
}

const defaultSteps = [
  ['resolve', defaultGetSuccess],
  ['reject', defaultGetError],
]

const defaultWarning = {
  message: 'message',
  type: 'WarningType',
  code: '500',
  detail: 'Detail',
}

module.exports = {
  defaultGetError,
  defaultGetSuccess,
  defaultSteps,
  defaultWarning,
}
