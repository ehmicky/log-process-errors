import { argv } from 'process'

import logProcessErrors from '../../../src/main.js'
import { stubStackTrace } from '../stack.js'
import { EVENTS } from '../emit/main.js'

stubStackTrace()

const stopLogging = logProcessErrors()

const [, , eventName] = argv
EVENTS[eventName]()
  .then(stopLogging)
  .catch(stopLogging)
