'use strict'

const { wrapFunction } = require('./wrap')

const fireFunction = function() {
  // eslint-disable-next-line no-new, promise/avoid-new
  new Promise((resolve, reject) => {
    resolve({ success: true })
    reject(new Error('message'))
  })
}

const fireMultipleResolves = wrapFunction.bind(null, fireFunction)

module.exports = {
  fireMultipleResolves,
}
