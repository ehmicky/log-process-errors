'use strict'

// eslint-disable-next-line import/no-unassigned-import, node/no-missing-require, import/no-unresolved
require('../../../register')

const logProcessErrors = require('../../src')

const stopLogging = logProcessErrors()
stopLogging()
