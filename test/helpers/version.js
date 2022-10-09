import { version } from 'process'

import semver from 'semver'

// TODO: remove after dropping support for Node <15.0.0
// Node 15.0.0 changed the default exit behavior on unhandled promises
export const hasOldExitBehavior = function (eventName) {
  return (
    PROMISE_REJECTION_EVENTS.has(eventName) &&
    semver.lt(version, NEW_EXIT_MIN_VERSION)
  )
}

const PROMISE_REJECTION_EVENTS = new Set([
  'unhandledRejection',
  'rejectionHandled',
])

const NEW_EXIT_MIN_VERSION = '15.0.0'
