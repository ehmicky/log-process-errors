import { emitWarning } from 'process'

import { multipleValidOptions } from 'jest-validate'

import { result, mapValues, pickBy } from './utils.js'

// Retrieve error's log level
export const getLevel = function({ opts, name, error }) {
  const level = result(opts.level[name], error)

  if (level === 'default' || level === undefined) {
    return DEFAULT_LEVEL[name]
  }

  if (LEVELS.includes(level)) {
    return level
  }

  emitWarning(
    `Invalid option 'level.${name}' returning '${level}': function must return one of ${LEVELS.join(
      ', ',
    )}`,
  )

  return DEFAULT_LEVEL[name]
}

// Apply `opts.level.default` and default values to `opts.level`
export const applyDefaultLevels = function({
  opts: { level: { default: defaultLevel, ...level } = {} },
}) {
  const levelA = pickBy(level, value => value !== undefined)

  if (defaultLevel === undefined) {
    return { ...DEFAULT_LEVEL, ...levelA }
  }

  const defaultLevels = mapValues(DEFAULT_LEVEL, () => defaultLevel)
  return { ...defaultLevels, ...levelA }
}

// Use during options validation
export const getExampleLevels = function() {
  return mapValues(DEFAULT_LEVEL, getExampleLevel)
}

const getExampleLevel = function(level) {
  // eslint-disable-next-line no-empty-function
  return multipleValidOptions(level, () => {})
}

export const validateLevels = function({ level }) {
  Object.entries(level).forEach(validateLevel)
}

const validateLevel = function([name, level]) {
  if (isValidLevel({ level })) {
    return
  }

  throw new Error(
    `Invalid option 'level.${name}' '${level}': must be a function or one of ${LEVELS.join(
      ', ',
    )}`,
  )
}

const isValidLevel = function({ level }) {
  return (
    LEVELS.includes(level) || level === undefined || typeof level === 'function'
  )
}

export const LEVELS = ['debug', 'info', 'warn', 'error', 'silent', 'default']

export const DEFAULT_LEVEL = {
  default: 'error',
  uncaughtException: 'error',
  warning: 'warn',
  unhandledRejection: 'error',
  rejectionHandled: 'error',
  multipleResolves: 'info',
}
