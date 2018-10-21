'use strict'

const { nextTick } = require('process')

const { wrapFunction } = require('./wrap')

const fireFunction = function() {
  nextTick(() => {
    throw new Error('message')
  })
}

const fireUncaughtException = wrapFunction.bind(null, fireFunction)

module.exports = {
  fireUncaughtException,
}
