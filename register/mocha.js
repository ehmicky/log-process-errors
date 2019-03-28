// Meant to be performed as `node -r log-process-errors/register/mocha`
// or `require('log-process-errors/register/mocha')`.
'use strict'

const logProcessErrors = require('./main')

logProcessErrors({ testing: 'mocha' })
