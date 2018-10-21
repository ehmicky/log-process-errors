'use strict'

const { emitWarning } = require('process')

const { wrapFunction } = require('./wrap')

const fireFunction = function() {
  emitWarning('message', { type: 'WarningType', code: '500', detail: 'Detail' })
}

const fireWarning = wrapFunction.bind(null, fireFunction)

module.exports = {
  fireWarning,
}
