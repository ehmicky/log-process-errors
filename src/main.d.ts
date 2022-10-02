/**
 * Actual logging level
 */
export type Level = 'debug' | 'info' | 'warn' | 'error'

/**
 * Configured logging level
 */
export type LevelOption = Level | 'default' | 'silent'

/**
 * Process error's `name`
 */
export type ErrorName =
  | 'uncaughtException'
  | 'warning'
  | 'unhandledRejection'
  | 'rejectionHandled'

declare class ProcessError extends Error {
  name:
    | 'UncaughtException'
    | 'UnhandledRejection'
    | 'RejectionHandled'
    | 'MultipleResolves'
    | 'Warning'
}

export type Options = Partial<{
  /**
   * By default process errors will be logged to the console using
   * `console.error()`, `console.warn()`, etc.
   * This behavior can be overridden with the `log` option.
   *
   * If logging is asynchronous, the function should return a promise (or use
   * `async`/`await`). This is not necessary if logging is buffered (like
   * [Winston](https://github.com/winstonjs/winston)).
   *
   * @default `console.error()`, `console.warn()`, etc.
   *
   * @example
   * ```js
   * logProcessErrors({
   *   log(error, level, originalError) {
   *     winstonLogger[level](error.stack)
   *   },
   * })
   * ```
   */
  log: (
    error: ProcessError,
    level: Level,
    originalError: Error,
  ) => Promise<void> | void

  /**
   * Which log level to use.
   *
   * @default { warning: 'warn', default: 'error' }
   *
   * @example
   * ```js
   * logProcessErrors({
   *   level: {
   *     // Use `debug` log level for `uncaughtException` instead of `error`
   *     uncaughtException: 'debug',
   *
   *     // Skip some logs based on a condition
   *     default(error) {
   *       return shouldSkip(error) ? 'silent' : 'default'
   *     },
   *   },
   * })
   * ```
   */
  level: {
    [errorName in ErrorName | 'default']?:
      | LevelOption
      | ((error: ProcessError) => LevelOption)
  }

  /**
   * Which process errors should trigger `process.exit(1)`:
   *  - `['uncaughtException', 'unhandledRejection']` is Node.js default
   *    behavior since Node.js `15.0.0`. Before, only
   *    [`uncaughtException`](https://nodejs.org/api/process.html#process_warning_using_uncaughtexception_correctly)
   *    was enabled.
   *  - use `[]` to prevent any `process.exit(1)`. Recommended if your process
   *    is long-running and does not automatically restart on exit.
   *
   * `process.exit(1)` will only be fired after successfully logging the process
   * error.
   *
   * @default `['uncaughtException', 'unhandledRejection']` for Node
   * `>= 15.0.0`, `['uncaughtException']` otherwise.
   *
   * @example
   * ```js
   * logProcessErrors({ exitOn: ['uncaughtException', 'unhandledRejection'] })
   * ```
   */
  exitOn: Level[]
}>

/**
 * Function that can be fired to restore Node.js default behavior.
 *
 * @example
 * ```js
 * const restore = logProcessErrors(options)
 * restore()
 * ```
 */
export type Undo = () => void

/**
 * Improve how process errors are logged.
 * Should be called as early as possible in the code, before other `import`
 * statements.
 *
 * @example
 * ```js
 * logProcessErrors(options)
 * ```
 */
export default function logProcessErrors(options?: Options): Undo
