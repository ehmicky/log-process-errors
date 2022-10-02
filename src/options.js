import { version } from 'process'

import { excludeKeys } from 'filter-obj'
import { validate } from 'jest-validate'
import semver from 'semver'

import { validateExitOn } from './exit.js'
import { defaultLog } from './log.js'

// Validate options and assign default options
export const getOptions = function (opts = {}) {
  const optsA = excludeKeys(opts, isUndefined)
  validate(optsA, { exampleConfig: EXAMPLE_OPTS })
  validateExitOn(optsA.exitOn)
  return { ...DEFAULT_OPTS, ...optsA }
}

const isUndefined = function (key, value) {
  return value === undefined
}

// Since Node 15.0.0, `unhandledRejection` makes the process exit too
// TODO: remove after dropping support for Node <15.0.0
const getDefaultExitOn = function () {
  return isNewExitBehavior()
    ? ['uncaughtException', 'unhandledRejection']
    : ['uncaughtException']
}

const isNewExitBehavior = function () {
  return semver.gte(version, NEW_EXIT_MIN_VERSION)
}

const NEW_EXIT_MIN_VERSION = '15.0.0'

const DEFAULT_OPTS = {
  log: defaultLog,
  exitOn: getDefaultExitOn(),
}

// `validate-jest` prints the function body
// eslint-disable-next-line no-empty-function
const exampleFunction = function () {}

const EXAMPLE_OPTS = {
  ...DEFAULT_OPTS,
  log: exampleFunction,
}
