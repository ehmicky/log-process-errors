import { version } from 'process'

import colorsOption from 'colors-option'
import filterObj from 'filter-obj'
import { validate } from 'jest-validate'
import { gte as gteVersion } from 'semver'

import { validateExitOn } from '../exit.js'
import {
  applyDefaultLevels,
  getExampleLevels,
  validateLevels,
} from '../level.js'
import { defaultLog } from '../log.js'

import { applyTesting, getExampleTesting } from './testing.js'

// Validate options and assign default options
export const getOptions = function ({ opts = {} }) {
  const optsA = filterObj(opts, isDefined)

  validate(optsA, { exampleConfig: EXAMPLE_OPTS })
  validateOptions(optsA)

  const optsB = applyTesting({ opts: optsA })
  const level = applyDefaultLevels({ opts: optsB })
  const { colors, ...optsC } = { ...DEFAULT_OPTS, ...optsB, level }

  const chalk = colorsOption({ colors })
  return { ...optsC, chalk }
}

const isDefined = function (key, value) {
  return value !== undefined
}

// Since Node 15.0.0, `unhandledRejection` makes the process exit too
// TODO: remove after dropping support for Node <15.0.0
const getDefaultExitOn = function () {
  if (isNewExitBehavior()) {
    return ['uncaughtException', 'unhandledRejection']
  }

  return ['uncaughtException']
}

const isNewExitBehavior = function () {
  return gteVersion(version, NEW_EXIT_MIN_VERSION)
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
  colors: true,
  log: exampleFunction,
  level: getExampleLevels(),
  testing: getExampleTesting(),
}

// Validation beyond what `jest-validate` can do
const validateOptions = function ({ exitOn, level = {} }) {
  validateLevels({ level })
  validateExitOn({ exitOn })
}
