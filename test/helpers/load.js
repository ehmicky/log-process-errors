import { argv } from 'process'

// eslint-disable-next-line import/order
import logProcessErrors from 'log-process-errors'
import { EVENTS_MAP } from './events.js'

const stopLogging = logProcessErrors()

const [, , eventName] = argv
EVENTS_MAP[eventName].emit().then(stopLogging).catch(stopLogging)
