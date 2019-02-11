'use strict'

const { argv } = require('process')

// While Ava uses Babel by default, it does not do it on child processes,
// i.e. this is needed.
// eslint-disable-next-line import/no-unassigned-import
require('@babel/register')

// eslint-disable-next-line import/no-unassigned-import
require('../../register')

const { stubStackTrace } = require('./stack')
const { EVENTS } = require('./emit')

stubStackTrace()

const [, , eventName] = argv
EVENTS[eventName]()
