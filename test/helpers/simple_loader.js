'use strict'

const { argv } = require('process')

// eslint-disable-next-line import/no-unassigned-import
require('../../register')

// While Ava uses Babel by default, it does not do it on child processes,
// i.e. this is needed.
// It needs to be performed after source files are required.
// eslint-disable-next-line import/no-unassigned-import
require('@babel/register')

const { stubStackTrace } = require('./stack')
const { EVENTS } = require('./emit')

stubStackTrace()

const [, , eventName] = argv
EVENTS[eventName]()
