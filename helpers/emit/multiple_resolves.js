'use strict'

const { promisify } = require('util')

const { defaultSteps } = require('./default')

// Emit a `multipleResolves` event
const multipleResolves = async function(steps = defaultSteps) {
  // eslint-disable-next-line no-new, promise/avoid-new
  new Promise((resolve, reject) => {
    steps.forEach(([type, value]) => {
      const func = type === 'resolve' ? resolve : reject
      func(value())
    })
  })

  await promisify(setImmediate)()
}

module.exports = {
  multipleResolves,
}
