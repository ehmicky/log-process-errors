'use strict'

const { argv } = require('process')

// eslint-disable-next-line import/no-unassigned-import, import/no-internal-modules
require('../../localpack/register')

const { stubStackTrace } = require('./stack')
const { EVENTS } = require('./emit')

stubStackTrace()

const [, , eventName] = argv
EVENTS[eventName]()
