import { excludeKeys } from 'filter-obj'
import { validate } from 'jest-validate'

import { defaultLog } from './log.js'

// Validate options and assign default options
export const getOptions = function (opts = {}) {
  const optsA = excludeKeys(opts, isUndefined)
  validate(optsA, { exampleConfig: EXAMPLE_OPTS })
  return { ...DEFAULT_OPTS, ...optsA }
}

const isUndefined = function (key, value) {
  return value === undefined
}

const DEFAULT_OPTS = {
  log: defaultLog,
  keep: false,
}

// `validate-jest` prints the function body
// eslint-disable-next-line no-empty-function
const exampleFunction = function () {}

const EXAMPLE_OPTS = {
  ...DEFAULT_OPTS,
  log: exampleFunction,
}
