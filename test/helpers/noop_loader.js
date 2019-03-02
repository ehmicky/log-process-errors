'use strict'

// eslint-disable-next-line import/no-unassigned-import, node/no-missing-require, import/no-unresolved
require('../../../register')

// While Ava uses Babel by default, it does not do it on child processes,
// i.e. this is needed.
// It needs to be performed after source files are required.
// eslint-disable-next-line import/no-unassigned-import
require('@babel/register')

const logProcessErrors = require('../../src')

const stopLogging = logProcessErrors()
stopLogging()
