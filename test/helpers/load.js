import { argv } from 'process'

// eslint-disable-next-line import/order
import logProcessErrors from 'log-process-errors'
import { emit } from './events.js'

const stopLogging = logProcessErrors()

const [, , eventName] = argv
emit(eventName).then(stopLogging).catch(stopLogging)
