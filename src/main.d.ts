/**
 * The reason why the process error occurred.
 */
export type Reason =
  | 'uncaughtException'
  | 'warning'
  | 'unhandledRejection'
  | 'rejectionHandled'

export type Options = {
  /**
   * Prevent exiting the process on
   * [uncaught exceptions](https://nodejs.org/api/process.html#process_event_uncaughtexception)
   * or
   * [unhandled promises](https://nodejs.org/api/process.html#process_event_unhandledrejection).
   *
   * @default false
   */
  readonly exit?: boolean

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
  readonly log?: (error: Error, reason: Reason) => Promise<void> | void
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
