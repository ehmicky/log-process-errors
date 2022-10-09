import process, { version } from 'process'
import { promisify } from 'util'

// TODO: replace with `timers/promises` `setTimeout()` after dropping support
// for Node <15.0.0
const pSetTimeout = promisify(setTimeout)

// Exit process on `uncaughtException` and `unhandledRejection`
//  - This is the default behavior of Node.js
//  - This is recommended by
//     https://nodejs.org/api/process.html#process_warning_using_uncaughtexception_correctly
// This can be disabled or forced with the `keep` option.
// The process exits by default, except if there are other listeners for those
// events
//  - This delegates the decision to exit or not to those listeners
//     - Since they would need to make that decision as well
//     - And they might exit only after some logic is performed first
//        - E.g. Winston waits for logging up to 3s before calling
//          `process.exit()`
export const exitProcess = async function (keep, reason) {
  if (!shouldExit(keep, reason)) {
    return
  }

  process.exitCode = EXIT_STATUS
  await pSetTimeout(EXIT_TIMEOUT, undefined, { ref: false })
  forceExitProcess()
}

const shouldExit = function (keep, reason) {
  if (!isExitEvent(reason)) {
    return false
  }

  if (keep !== undefined) {
    return !keep
  }

  return process.listeners(reason).length <= 1
}

const isExitEvent = function (reason) {
  return (
    reason === 'uncaughtException' ||
    (reason === 'unhandledRejection' && hasNewExitBehavior())
  )
}

// Since Node 15.0.0, `unhandledRejection` makes the process exit too
// TODO: remove after dropping support for Node <15.0.0
const hasNewExitBehavior = function () {
  return Number(version.split('.')[0].replace('v', '')) >= NEW_EXIT_MIN_VERSION
}

const NEW_EXIT_MIN_VERSION = 15

// Let tasks complete for a few seconds before forcing the exit
const forceExitProcess = function () {
  // eslint-disable-next-line unicorn/no-process-exit, n/no-process-exit
  process.exit(EXIT_STATUS)
}

const EXIT_TIMEOUT = 3000
const EXIT_STATUS = 1
