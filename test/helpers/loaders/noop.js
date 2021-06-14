// eslint-disable-next-line import/order, import/no-unassigned-import, import/no-unresolved, node/no-missing-import
import 'log-process-errors/register.js'

// eslint-disable-next-line import/order, node/no-extraneous-import
import logProcessErrors from 'log-process-errors'

const stopLogging = logProcessErrors()
stopLogging()
