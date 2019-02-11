'use strict'

const { version } = require('process')

const semver = require('semver')

// `multipleResolves` was introduced in Node `10.12.0`
const hasMultipleResolves = function() {
  return semver.gte(version, MULTIPLE_RESOLVES_V)
}

const MULTIPLE_RESOLVES_V = '10.12.0'

module.exports = {
  hasMultipleResolves,
}
