import { validate } from 'jest-validate'
import filterObj from 'filter-obj'

import {
  applyDefaultLevels,
  getExampleLevels,
  validateLevels,
} from '../level.js'
import { validateExitOn } from '../exit.js'
import { defaultLog } from '../log.js'
import { addChalk, DEFAULT_COLORS } from '../colors.js'

import { applyTesting, getExampleTesting } from './testing.js'

// Validate options and assign default options
export const getOptions = function({ opts = {} }) {
  const optsA = filterObj(opts, isDefined)

  validate(optsA, { exampleConfig: EXAMPLE_OPTS })
  validateOptions(optsA)

  const optsB = applyTesting({ opts: optsA })
  const level = applyDefaultLevels({ opts: optsB })
  const optsC = { ...DEFAULT_OPTS, ...optsB, level }

  const optsD = addChalk({ opts: optsC })
  return optsD
}

const isDefined = function(key, value) {
  return value !== undefined
}

const DEFAULT_OPTS = {
  log: defaultLog,
  exitOn: ['uncaughtException'],
  colors: DEFAULT_COLORS,
}

// `validate-jest` prints the function body
// eslint-disable-next-line no-empty-function
const exampleFunction = function() {}

const EXAMPLE_OPTS = {
  ...DEFAULT_OPTS,
  log: exampleFunction,
  level: getExampleLevels(),
  testing: getExampleTesting(),
}

// Validation beyond what `jest-validate` can do
const validateOptions = function({ exitOn, level = {} }) {
  validateLevels({ level })
  validateExitOn({ exitOn })
}
