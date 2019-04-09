// Meant to be performed as `node -r log-process-errors/build/register/jasmine`
// or `import 'log-process-errors/build/register/jasmine'`.
import logProcessErrors from '../src/main.js'

logProcessErrors({ testing: 'jasmine' })
