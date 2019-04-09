// Meant to be performed as `node -r log-process-errors/build/register/mocha`
// or `import 'log-process-errors/build/register/mocha'`.
import logProcessErrors from '../src/main.js'

logProcessErrors({ testing: 'mocha' })
