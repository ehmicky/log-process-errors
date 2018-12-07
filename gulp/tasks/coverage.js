'use strict'

const {
  env: { TRAVIS_REPO_SLUG, TRAVIS_COMMIT },
} = require('process')

const isCi = require('is-ci')
const fetch = require('cross-fetch')
const PluginError = require('plugin-error')

// In CI, once each environment has sent their test coverage maps, we check that
// when merging them we are above the minimum threshold
const checkCoverage = async function() {
  if (!isCi) {
    return
  }

  const coverage = await getCoverage()

  if (coverage < COVERAGE_THRESHOLD) {
    throw new PluginError(
      'gulp-codecov-check',
      `Test coverage is ${coverage}% but should be at least ${COVERAGE_THRESHOLD}%`,
    )
  }
}

const getCoverage = async function() {
  const codecovUrl = `https://codecov.io/api/gh/${TRAVIS_REPO_SLUG}/commit/${TRAVIS_COMMIT}`
  const response = await fetch(codecovUrl)
  const {
    commit: {
      // eslint-disable-next-line id-length
      totals: { c: coverage },
    },
  } = await response.json()

  const coverageA = Number(coverage)
  return coverageA
}

const COVERAGE_THRESHOLD = 100

module.exports = {
  checkCoverage,
}
