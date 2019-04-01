'use strict'

const { promisify } = require('util')

const pSetImmediate = promisify(setImmediate)

// Emit a `multipleResolves` event
const multipleResolves = async function({ all = false } = {}) {
  const allSteps = all ? STEPS : [STEPS[0]]
  allSteps.forEach(createPromise)

  await pSetImmediate()
}

const createPromise = function(steps) {
  // eslint-disable-next-line no-new, promise/avoid-new
  new Promise((resolve, reject) => {
    steps.forEach(([type, value]) => {
      const func = type === 'resolve' ? resolve : reject
      func(value())
    })
  })
}

const getSuccess = function() {
  return { success: true }
}

const getError = function() {
  return new Error('message')
}

const resolveStep = ['resolve', getSuccess]
const rejectStep = ['reject', getError]

const STEPS = [
  [resolveStep, rejectStep],
  [resolveStep, resolveStep],
  [rejectStep, resolveStep],
  [rejectStep, rejectStep],
]

module.exports = {
  multipleResolves,
}
