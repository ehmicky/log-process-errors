import { argv } from 'process'

// We use `import` instead of the `-r` flag because Istanbul does not cover
// files loaded with the `-r` flag:
//   https://github.com/istanbuljs/istanbuljs.github.io/issues/144
// eslint-disable-next-line import/order, import/no-unassigned-import, import/no-unresolved, node/no-missing-import
import 'log-process-errors/register.js'
import { EVENTS_MAP } from '../events/main.js'

const [, , eventName] = argv
EVENTS_MAP[eventName].emit()
