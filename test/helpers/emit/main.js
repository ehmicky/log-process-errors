import { uncaughtException } from './uncaught_exception.js'
import { unhandledRejection } from './unhandled_rejection.js'
import { rejectionHandled } from './rejection_handled.js'
import { multipleResolves } from './multiple_resolves.js'
import { warning } from './warning.js'
import { hasMultipleResolves } from './version.js'

export const EVENTS = {
  uncaughtException,
  unhandledRejection,
  rejectionHandled,
  ...(hasMultipleResolves() ? { multipleResolves } : {}),
  warning,
}
