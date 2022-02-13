import { emitWarning } from 'process'

import filterObj from 'filter-obj'
import { multipleValidOptions } from 'jest-validate'
import mapObj from 'map-obj'

import { result } from './utils.js'

// Retrieve error's log level
export const getLevel = function ({ opts, name, error }) {
  const level = result(opts.level[name], error)

  if (level === 'default' || level === undefined) {
    return DEFAULT_LEVEL[name]
  }

  if (LEVELS.has(level)) {
    return level
  }

  emitWarning(
    `Invalid option 'level.${name}' returning '${level}': function must return one of ${LEVELS_ARR.join(
      ', ',
    )}`,
  )

  return DEFAULT_LEVEL[name]
}

// Apply `opts.level.default` and default values to `opts.level`
export const applyDefaultLevels = function ({
  opts: { level: { default: defaultLevel, ...level } = {} },
}) {
  const levelA = filterObj(level, isDefined)

  if (defaultLevel === undefined) {
    return { ...DEFAULT_LEVEL, ...levelA }
  }

  const defaultLevels = mapObj(DEFAULT_LEVEL, (eventName) => [
    eventName,
    defaultLevel,
  ])
  return { ...defaultLevels, ...levelA }
}

const isDefined = function (key, value) {
  return value !== undefined
}

// Use during options validation
export const getExampleLevels = function () {
  return mapObj(DEFAULT_LEVEL, getExampleLevel)
}

const getExampleLevel = function (eventName, level) {
  // eslint-disable-next-line no-empty-function
  return [eventName, multipleValidOptions(level, () => {})]
}

export const validateLevels = function ({ level }) {
  Object.entries(level).forEach(validateLevel)
}

const validateLevel = function ([name, level]) {
  if (isValidLevel({ level })) {
    return
  }

  throw new Error(
    `Invalid option 'level.${name}' '${level}': must be a function or one of ${LEVELS_ARR.join(
      ', ',
    )}`,
  )
}

const isValidLevel = function ({ level }) {
  return LEVELS.has(level) || level === undefined || typeof level === 'function'
}

const LEVELS_ARR = ['debug', 'info', 'warn', 'error', 'silent', 'default']
const LEVELS = new Set(LEVELS_ARR)

const DEFAULT_LEVEL = {
  default: 'error',
  uncaughtException: 'error',
  warning: 'warn',
  unhandledRejection: 'error',
  rejectionHandled: 'error',
}
