// Meant to be performed as `node -r log-process-errors/register/tape`
// or `require('log-process-errors/register/tape')`.
'use strict'

const logProcessErrors = require('./main')

logProcessErrors({ testing: 'tape' })
