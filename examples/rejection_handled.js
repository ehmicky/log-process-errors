'use strict'

const { promisify } = require('util')

const { wrapFunction } = require('./wrap')

const fireFunction = async function() {
  const promise = Promise.reject(new Error('message'))

  await promisify(setImmediate)()

  // eslint-disable-next-line no-empty-function
  promise.catch(() => {})
}

const fireRejectionHandled = wrapFunction.bind(null, fireFunction)

module.exports = {
  fireRejectionHandled,
}
