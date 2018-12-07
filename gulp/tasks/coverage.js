'use strict'

const {
  env: {
    TRAVIS_REPO_SLUG,
    TRAVIS_PULL_REQUEST_SLUG,
    TRAVIS_COMMIT,
    TRAVIS_PULL_REQUEST_SHA,
    TRAVIS_BRANCH,
    // eslint-disable-next-line id-length
    TRAVIS_PULL_REQUEST_BRANCH,
    TRAVIS_PULL_REQUEST,
  },
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
  const codecovUrl = getCodecovUrl()
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

// eslint-disable-next-line max-statements
const getCodecovUrl = function() {
  const slug = TRAVIS_REPO_SLUG || TRAVIS_PULL_REQUEST_SLUG
  const commit = TRAVIS_COMMIT || TRAVIS_PULL_REQUEST_SHA
  // eslint-disable-next-line no-console, no-restricted-globals
  console.log('TRAVIS_REPO_SLUG', TRAVIS_REPO_SLUG)
  // eslint-disable-next-line no-console, no-restricted-globals
  console.log('TRAVIS_PULL_REQUEST_SLUG', TRAVIS_PULL_REQUEST_SLUG)
  // eslint-disable-next-line no-console, no-restricted-globals
  console.log('TRAVIS_COMMIT', TRAVIS_COMMIT)
  // eslint-disable-next-line no-console, no-restricted-globals
  console.log('TRAVIS_PULL_REQUEST_SHA', TRAVIS_PULL_REQUEST_SHA)
  // eslint-disable-next-line no-console, no-restricted-globals
  console.log('TRAVIS_BRANCH', TRAVIS_BRANCH)
  // eslint-disable-next-line no-console, no-restricted-globals
  console.log('TRAVIS_PULL_REQUEST_BRANCH', TRAVIS_PULL_REQUEST_BRANCH)
  // eslint-disable-next-line no-console, no-restricted-globals
  console.log('TRAVIS_PULL_REQUEST', TRAVIS_PULL_REQUEST)
  const codecovUrl = `https://codecov.io/api/gh/${slug}/commit/${commit}`
  return codecovUrl
}

const COVERAGE_THRESHOLD = 100

module.exports = {
  checkCoverage,
}
