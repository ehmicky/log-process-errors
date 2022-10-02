import process, { version } from 'process'

// Exit process on `uncaughtException` and `unhandledRejection`
//  - This is the default behavior of Node.js
//  - This is recommended by
//     https://nodejs.org/api/process.html#process_warning_using_uncaughtexception_correctly
// This can be disabled with the `keep: true` option.
export const exitProcess = function (keep, reason) {
  if (!shouldExit(keep, reason)) {
    return
  }

  // TODO: use `promisify` instead after
  // https://github.com/sinonjs/fake-timers/issues/223 is fixed
  // TODO: replace with `timers/promises` `setTimeout()` after dropping support
  // for Node <15.0.0
  process.exitCode = EXIT_STATUS
  setTimeout(forceExitProcess, EXIT_TIMEOUT).unref()
}

const shouldExit = function (keep, reason) {
  return (
    !keep &&
    (reason === 'uncaughtException' ||
      (reason === 'unhandledRejection' && hasNewExitBehavior()))
  )
}

// Since Node 15.0.0, `unhandledRejection` makes the process exit too
// TODO: remove after dropping support for Node <15.0.0
const hasNewExitBehavior = function () {
  return Number(version.split('.')[0].replace('v', '')) >= NEW_EXIT_MIN_VERSION
}

const NEW_EXIT_MIN_VERSION = 15

const forceExitProcess = function () {
  // eslint-disable-next-line unicorn/no-process-exit, n/no-process-exit
  process.exit(EXIT_STATUS)
}

const EXIT_TIMEOUT = 3000
const EXIT_STATUS = 1
