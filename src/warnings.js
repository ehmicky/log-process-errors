import process from 'node:process'

// By default Node.js adds a `warning` listener that prints `warning` events
// on the console. This leads to duplicated events printing with this module.
// So we remove it.
// Alternative ways to do it would be to ask users to pass `--no-warnings`
// CLI flag or `NODE_NO_WARNINGS=1` environment variable. But this is not as
// developer-friendly.
// This is a noop if `init()` is called several times
export const removeWarningListener = () => {
  if (warningListener !== undefined) {
    process.off('warning', warningListener)
  }
}

// When this module is undone, Node.js default `warning` listener is restored
// Do not restore if there is some user-defined listener, including if
// `init()` was called several times.
export const restoreWarningListener = () => {
  if (warningListener !== undefined && getWarningListeners().length === 0) {
    process.on('warning', warningListener)
  }
}

// We assume the first `warning` listener is the Node.js default one.
// Checking the function itself makes it rely on internal Node.js code, which
// is brittle.
// This can return an empty array if `--no-warnings` is used.
// This needs be done at load time to ensure:
//  - we are not catching user-defined listeners
//  - this is idempotent, allowing this module to be called several times
// One side effect is that it removes the possibility to use `--*deprecation`
// CLI flags
const getWarningListeners = () => process.listeners('warning')

const [warningListener] = getWarningListeners()
