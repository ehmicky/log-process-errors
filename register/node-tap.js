/* eslint-disable filenames/match-regex, unicorn/filename-case */
// Look for `spawn-wrap` in the codebase to see why Istanbul cannot cover this.
// Meant to be performed as `import 'log-process-errors/node-tap.js'`.
import logProcessErrors from '../src/main.js'

logProcessErrors({ testing: 'node-tap' })
/* eslint-enable filenames/match-regex, unicorn/filename-case */
