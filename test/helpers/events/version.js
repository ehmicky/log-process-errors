import { version } from 'process'

import semver from 'semver'

// TODO: remove after dropping support for Node <12.0.0
// `--unhandled-rejections` was introduced in Node `12.0.0`
export const hasUnhandledFlag = function () {
  return semver.gte(version, UNHANDLED_FLAG_V)
}

const UNHANDLED_FLAG_V = '12.0.0'
