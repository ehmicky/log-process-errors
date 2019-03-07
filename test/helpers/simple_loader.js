'use strict'

const { argv } = require('process')

// eslint-disable-next-line import/no-unassigned-import, node/no-missing-require, import/no-unresolved
require('../../../register')

const { stubStackTrace } = require('./stack')
const { EVENTS } = require('./emit')

stubStackTrace()

const [, , name] = argv
EVENTS[name]()
