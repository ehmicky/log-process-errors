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

module.exports = {
  defaultGetError,
  defaultGetSuccess,
  defaultSteps,
}
