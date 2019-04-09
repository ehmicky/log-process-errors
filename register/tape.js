// Meant to be performed as `node -r log-process-errors/build/register/tape`
// or `import 'log-process-errors/build/register/tape'`.
import logProcessErrors from '../src/main.js'

logProcessErrors({ testing: 'tape' })
