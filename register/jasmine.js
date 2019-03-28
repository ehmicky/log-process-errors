// Meant to be performed as `node -r log-process-errors/register/jasmine`
// or `require('log-process-errors/register/jasmine')`.
'use strict'

const logProcessErrors = require('./main')

logProcessErrors({ testing: 'jasmine' })
