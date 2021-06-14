// Meant to be performed as `node -r log-process-errors/mocha.js`
// or `import 'log-process-errors/mocha.js'`.
import logProcessErrors from '../src/main.js'

logProcessErrors({ testing: 'mocha' })
