// Meant to be performed as `node -r log-process-errors/build/register/jasmine`
// or `require('log-process-errors/build/register/jasmine')`.
'use strict'

const logProcessErrors = require('../src')

logProcessErrors({ testing: 'jasmine' })
