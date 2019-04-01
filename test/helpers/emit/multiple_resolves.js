'use strict'

const { promisify } = require('util')

const { defaultGetError } = require('./default')

const pSetImmediate = promisify(setImmediate)

// Emit a `multipleResolves` event
const multipleResolves = async function() {
  createPromise(STEPS)

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

const resolveStep = ['resolve', getSuccess]
const rejectStep = ['reject', defaultGetError]

const STEPS = [resolveStep, rejectStep]

module.exports = {
  multipleResolves,
}
