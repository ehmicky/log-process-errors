'use strict'

const { argv } = require('process')

const logProcessErrors = require('../../../src')
const { stubStackTrace } = require('../stack')
const { EVENTS } = require('../emit')

stubStackTrace()

const stopLogging = logProcessErrors()

const [, , name] = argv
EVENTS[name]()
  .then(stopLogging)
  .catch(stopLogging)
