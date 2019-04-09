// Meant to be performed as `node -r log-process-errors/build/register/ava`
// or `require('log-process-errors/build/register/ava')`.
'use strict'

const logProcessErrors = require('../src')

logProcessErrors({ testing: 'ava' })
