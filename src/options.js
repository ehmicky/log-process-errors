import isPlainObj from 'is-plain-obj'

// Undocumented named export to validate options
export const validateOptions = function (opts) {
  getOptions(opts)
}

// Validate options and assign default options
export const getOptions = function (opts = {}) {
  if (!isPlainObj(opts)) {
    throw new TypeError(`Options must be a plain object: ${opts}`)
  }

  const { exit, onError = defaultOnError, ...unknownOpts } = opts

  validateExit(exit)

  if (typeof onError !== 'function') {
    throw new TypeError(`Option "onError" must be a function: ${onError}`)
  }

  validateUnknownOpts(unknownOpts)

  return { exit, onError }
}

const validateExit = function (exit) {
  if (exit !== undefined && typeof exit !== 'boolean') {
    throw new TypeError(`Option "exit" must be a boolean: ${exit}`)
  }
}

// `console` should be referenced inside this function, not outside, as user
// might monkey patch it.
const defaultOnError = function (error) {
  // eslint-disable-next-line no-restricted-globals, no-console
  console.error(error)
}

const validateUnknownOpts = function (unknownOpts) {
  const [unknownOpt] = Object.keys(unknownOpts)

  if (unknownOpt !== undefined) {
    throw new TypeError(`Option "${unknownOpt}" is unknown.`)
  }
}
