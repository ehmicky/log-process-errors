// eslint-disable-next-line import/no-unassigned-import
import '../../../register/index.js'
import logProcessErrors from '../../../src/main.js'

const stopLogging = logProcessErrors()
stopLogging()
