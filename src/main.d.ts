/**
 * Why the process error was created
 */
export type Reason =
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

export type Options = {
  /**
   * Function called once per process error.
   * Duplicate process errors are ignored.
   *
   * @default console.error(error)
   *
   * @example
   * ```js
   * // Log process errors with Winston instead
   * logProcessErrors({
   *   log(error, reason) {
   *     winstonLogger.error(error.stack)
   *   },
   * })
   * ```
   */
  readonly log?: (error: ProcessError, reason: Reason) => Promise<void> | void

  /**
   * Prevent exiting the process on
   * [uncaught exception](https://nodejs.org/api/process.html#process_event_uncaughtexception)
   * or
   * [unhandled promise](https://nodejs.org/api/process.html#process_event_unhandledrejection).
   *
   * @default false
   */
  readonly keep?: boolean
}

/**
 * Restores Node.js default behavior.
 *
 * @example
 * ```js
 * const restore = logProcessErrors(options)
 * restore()
 * ```
 */
type Undo = () => void

/**
 * Improve how process errors are logged.
 *
 * @example
 * ```js
 * logProcessErrors(options)
 * ```
 */
export default function logProcessErrors(options?: Options): Undo
