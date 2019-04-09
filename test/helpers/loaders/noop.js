'use strict'

// eslint-disable-next-line import/no-unassigned-import
require('../../../register')

const logProcessErrors = require('../../../src')

const stopLogging = logProcessErrors()
stopLogging()
