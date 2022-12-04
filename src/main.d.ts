/**
 * Process event name
 */
export type Event =
  | 'uncaughtException'
  | 'warning'
  | 'unhandledRejection'
  | 'rejectionHandled'

export interface Options {
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
   *   onError(error, event) {
   *     winstonLogger.error(error.stack)
   *   },
   * })
   * ```
   */
  readonly onError?: (error: Error, event: Event) => Promise<void> | void
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
