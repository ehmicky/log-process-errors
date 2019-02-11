'use strict'

const { argv } = require('process')

// eslint-disable-next-line import/no-unassigned-import
require('../../register')

const { stubStackTrace } = require('./stack')
const { EVENTS } = require('./emit')

stubStackTrace()

const [, , eventName] = argv
EVENTS[eventName]()
