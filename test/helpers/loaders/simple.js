import { argv } from 'process'

import logProcessErrors from '../../../src/main.js'
import { stubStackTrace } from '../stack.js'
import { EVENTS_MAP } from '../events/main.js'

stubStackTrace()

const stopLogging = logProcessErrors()

const [, , eventName] = argv
EVENTS_MAP[eventName].emitEvent()
  .then(stopLogging)
  .catch(stopLogging)
