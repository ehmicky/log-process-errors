import { version } from 'process'

import semver from 'semver'

// `multipleResolves` was introduced in Node `10.12.0`
export const hasMultipleResolves = function() {
  return semver.gte(version, MULTIPLE_RESOLVES_V)
}

const MULTIPLE_RESOLVES_V = '10.12.0'

// `--unhandled-rejections` was introduced in Node `12.0.0`
export const hasUnhandledFlag = function() {
  return semver.gte(version, UNHANDLED_FLAG_V)
}

const UNHANDLED_FLAG_V = '12.0.0'
