'use strict'

const test = require('ava')
const sinon = require('sinon')

const { repeat, startLogging } = require('./helpers')

const INVALID_OPTIONS = [
  { name: 'log', value: true },
  { name: 'level', value: true },
  { name: 'level', value: { warning: true } },
  { name: 'level', value: 'invalid' },
  { name: 'level', value: { warning: 'invalid' } },
  { name: 'message', value: true },
  { name: 'colors', value: 1 },
  { name: 'exitOn', value: true },
  { name: 'exitOn', value: ['invalid'] },
]

const WARNED_OPTIONS = [
  { name: 'unknown', value: true },
  { name: 'level', value: { unknown: 'error' } },
]

/* eslint-disable max-nested-callbacks */
repeat(INVALID_OPTIONS, (prefix, { name, value }) => {
  test(`${prefix} should validate options`, t => {
    t.throws(startLogging.bind(null, { [name]: value }))
  })
})

repeat(WARNED_OPTIONS, (prefix, { name, value }) => {
  test(`${prefix} should warn on additional options`, t => {
    // eslint-disable-next-line no-restricted-globals
    const stub = sinon.stub(console, 'warn')

    const { stopLogging } = startLogging({ [name]: value })

    t.is(stub.callCount, 1)
    t.snapshot(stub.firstCall.args[0])

    stopLogging()

    stub.restore()
  })
})
/* eslint-enable max-nested-callbacks */
