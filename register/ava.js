// Meant to be performed as `node -r log-process-errors/ava.js`
// or `import 'log-process-errors/ava.js'`.
import logProcessErrors from '../src/main.js'

logProcessErrors({ testing: 'ava' })
