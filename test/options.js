'use strict'

const test = require('ava')

const { startLogging } = require('./helpers')

const validateTest = function(t, value) {
  t.throws(startLogging.bind(null, value))
}

test('should validate opts.log() is a function', t => {
  validateTest(t, { log: true })
})

test('should validate opts.skipEvent() is a function', t => {
  validateTest(t, { skipEvent: true })
})

test('should validate opts.getLevel() is a function', t => {
  validateTest(t, { getLevel: true })
})

test('should validate opts.getMessage() is a function', t => {
  validateTest(t, { getMessage: true })
})

test('should validate opts.colors is a boolean', t => {
  validateTest(t, { colors: 1 })
})

test('should validate opts.exitOn is an array', t => {
  validateTest(t, { exitOn: true })
})
