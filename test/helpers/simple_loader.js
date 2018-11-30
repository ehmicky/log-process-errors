'use strict'

const { argv } = require('process')

// eslint-disable-next-line import/no-internal-modules
const { getPackage } = require('../../gulp/utils')

const { stubStackTrace } = require('./stack')
const { EVENTS } = require('./emit')

stubStackTrace()

// eslint-disable-next-line import/no-dynamic-require
require(`${getPackage()}/register`)

const [, , eventName] = argv
EVENTS[eventName]()
