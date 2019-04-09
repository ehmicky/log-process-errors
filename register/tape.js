// Meant to be performed as `node -r log-process-errors/build/register/tape`
// or `require('log-process-errors/build/register/tape')`.
'use strict'

const logProcessErrors = require('../src')

logProcessErrors({ testing: 'tape' })
