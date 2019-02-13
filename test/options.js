'use strict'

const test = require('ava')

const { repeat, startLogging } = require('./helpers')

const OPTIONS = [
  { name: 'log', wrongValue: true },
  { name: 'level', wrongValue: true },
  { name: 'level', wrongValue: { warning: true } },
  { name: 'message', wrongValue: true },
  { name: 'colors', wrongValue: 1 },
  { name: 'exitOn', wrongValue: true },
]

/* eslint-disable max-nested-callbacks */
repeat(OPTIONS, (prefix, { name, wrongValue }) => {
  test(`${prefix} should validate options`, t => {
    t.throws(startLogging.bind(null, { [name]: wrongValue }))
  })
})
/* eslint-enable max-nested-callbacks */
