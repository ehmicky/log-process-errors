// Meant to be performed as `node -r log-process-errors/register/ava`
// or `require('log-process-errors/register/ava')`.
'use strict'

const logProcessErrors = require('./main')

logProcessErrors({ test: 'ava' })
