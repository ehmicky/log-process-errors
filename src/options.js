import isPlainObj from 'is-plain-obj'

// Validate options and assign default options
export const getOptions = function (opts = {}) {
  if (!isPlainObj(opts)) {
    throw new TypeError(`Options must be a plain object: ${opts}`)
  }

  const { keep, log = defaultLog } = opts

  validateKeep(keep)

  if (typeof log !== 'function') {
    throw new TypeError(`Option "log" must be a function: ${log}`)
  }

  return { keep, log }
}

const validateKeep = function (keep) {
  if (keep !== undefined && typeof keep !== 'boolean') {
    throw new TypeError(`Option "keep" must be a boolean: ${keep}`)
  }
}

// `console` should be referenced inside this function, not outside, as user
// might monkey patch it.
const defaultLog = function (error) {
  // eslint-disable-next-line no-restricted-globals, no-console
  console.error(error)
}
