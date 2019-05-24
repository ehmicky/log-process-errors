import { version } from 'process'

import semver from 'semver'

// `multipleResolves` was introduced in Node `10.12.0`
export const hasMultipleResolves = function() {
  return semver.gte(version, MULTIPLE_RESOLVES_V)
}

const MULTIPLE_RESOLVES_V = '10.12.0'
