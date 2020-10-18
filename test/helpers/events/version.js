import { version } from 'process'

import { gte as gteVersion, lt as ltVersion } from 'semver'

// TODO: remove after dropping support for Node <12.0.0
// `--unhandled-rejections` was introduced in Node `12.0.0`
export const hasUnhandledFlag = function () {
  return gteVersion(version, UNHANDLED_FLAG_VERSION)
}

const UNHANDLED_FLAG_VERSION = '12.0.0'

// Node 15.0.0 changed the default exit behavior on unhandled promises
export const hasOldExitBehavior = function (eventName) {
  return (
    PROMISE_REJECTION_EVENTS.has(eventName) &&
    ltVersion(version, NEW_EXIT_MIN_VERSION)
  )
}

const PROMISE_REJECTION_EVENTS = new Set([
  'unhandledRejection',
  'rejectionHandled',
])

const NEW_EXIT_MIN_VERSION = '15.0.0'
