// Meant to be performed as `node -r log-process-errors/build/register/ava`
// or `import 'log-process-errors/build/register/ava'`.
import logProcessErrors from '../src/main.js'

logProcessErrors({ testing: 'ava' })
