import { argv } from 'process'

// eslint-disable-next-line import/order, import/no-unassigned-import, import/no-unresolved, node/no-missing-import
import 'log-process-errors/register.js'
import { EVENTS_MAP } from '../events/main.js'

const [, , eventName] = argv
EVENTS_MAP[eventName].emit()
