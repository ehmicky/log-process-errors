'use strict'

const { wrapFunction } = require('./wrap')

const fireFunction = function() {
  // eslint-disable-next-line promise/catch-or-return
  Promise.reject(new Error('message'))
}

const fireUnhandledRejection = wrapFunction.bind(null, fireFunction)

module.exports = {
  fireUnhandledRejection,
}
