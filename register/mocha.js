// Meant to be performed as `node -r log-process-errors/build/register/mocha`
// or `require('log-process-errors/build/register/mocha')`.
'use strict'

const logProcessErrors = require('../src')

logProcessErrors({ testing: 'mocha' })
