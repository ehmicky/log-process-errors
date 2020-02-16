// Do not destructure so tests can stub it
import process from 'process'

// Exit process according to `opts.exitOn` (default: ['uncaughtException']):
//  - `uncaughtException`: default behavior of Node.js and recommended by
//     https://nodejs.org/api/process.html#process_warning_using_uncaughtexception_correctly
//  - `unhandledRejection`: possible future behavior and recommended by Node.js.
//    See https://nodejs.org/dist/latest-v8.x/docs/api/deprecations.html#deprecations_dep0018_unhandled_promise_rejections
// By default `unhandledRejection` is opt-in so that using this library does not
// decrease stability (if the application does not restart on exit).
// `process.exit()` unfortunately aborts any current async operations and
// streams are not flushed (including stdout/stderr):
//  - https://github.com/nodejs/node/issues/784
//  - https://github.com/nodejs/node/issues/6456
// We go around this problem by:
//  - await promise returned by `opts.log()`
//  - waiting for few seconds (EXIT_TIMEOUT)
// This last one is a hack. We should instead allow `opts.log()` to return a
// stream, and keep track of all unique returned streams. On exit, we should
// then close them and wait for them to flush. We should then always wait for
// process.stdout|stderr as well.
export const exitProcess = function({ name, opts: { exitOn } }) {
  if (!exitOn.includes(name)) {
    return
  }

  // TODO: use `promisify` instead after
  // https://github.com/sinonjs/fake-timers/issues/223 is fixed
  setTimeout(() => {
    // eslint-disable-next-line unicorn/no-process-exit, no-process-exit
    process.exit(EXIT_STATUS)
  }, EXIT_TIMEOUT)
}

export const EXIT_TIMEOUT = 3000
export const EXIT_STATUS = 1

export const validateExitOn = function({ exitOn }) {
  if (exitOn === undefined) {
    return
  }

  const invalidEvents = exitOn.filter(name => !EVENTS.includes(name))

  if (invalidEvents.length === 0) {
    return
  }

  throw new Error(
    `Invalid option 'exitOn' '${invalidEvents.join(
      ', ',
    )}': must be one of ${EVENTS.join(', ')}`,
  )
}

const EVENTS = [
  'uncaughtException',
  'unhandledRejection',
  'rejectionHandled',
  'multipleResolves',
  'warning',
]
