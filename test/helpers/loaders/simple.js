import { argv } from 'process'

import logProcessErrors from '../../../src/main.js'
import { EVENTS_MAP } from '../events/main.js'

const stopLogging = logProcessErrors()

const [, , eventName] = argv
EVENTS_MAP[eventName].emit().then(stopLogging).catch(stopLogging)
