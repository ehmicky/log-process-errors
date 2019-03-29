// istanbul ignore file
// Look for `spawn-wrap` in the codebase to see why Istanbul cannot cover this.
/* eslint-disable filenames/match-regex, unicorn/filename-case */
// Meant to be performed as `node -r log-process-errors/register/node-tap`
// or `require('log-process-errors/register/node-tap')`.
'use strict'

const logProcessErrors = require('./main')

logProcessErrors({ testing: 'node-tap' })
/* eslint-enable filenames/match-regex, unicorn/filename-case */