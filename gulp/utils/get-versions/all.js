'use strict'

// eslint-disable-next-line import/no-internal-modules
const NODE_RELEASES = require('node-releases/data/processed/envs')
// eslint-disable-next-line import/no-internal-modules
const RELEASE_SCHEDULE = require('node-releases/data/release-schedule/release-schedule')
const { major, minor } = require('semver')
const moize = require('moize').default

// Retrieve all Node.js releases, grouped by major release.
// Major release also indicate:
//  - whether they are currently supported
//  - whether they are/were LTS
const getAllMajorReleases = function() {
  return Object.entries(RELEASE_SCHEDULE)
    .map(normalizeMajorRelease)
    .filter(hasReleases)
}

const mGetAllMajorReleases = moize(getAllMajorReleases)

const normalizeMajorRelease = function([
  majorVersion,
  { start, end, codename },
]) {
  // Strip 'v' from version
  const majorVersionA = majorVersion.slice(1)

  const supported = isSupported({ start, end })
  const lts = codename !== undefined
  const releases = getReleases({ majorVersion: majorVersionA })

  return { majorVersion: majorVersionA, supported, lts, releases }
}

// Check if Node.js is currently supporting this version
const isSupported = function({ start, end }) {
  const today = getToday()
  const supported = today >= start && today <= end
  return supported
}

const getToday = function() {
  return new Date().toISOString().slice(0, ISO_DATE_LENGTH)
}

const ISO_DATE_LENGTH = 10

// Group releases by their major version
const getReleases = function({ majorVersion }) {
  return NODE_RELEASES.filter(release =>
    releaseMatches({ release, majorVersion }),
  ).map(({ version }) => version)
}

const releaseMatches = function({ release: { name, version }, majorVersion }) {
  return name === NODE_JS_NAME && getMajorVersion({ version }) === majorVersion
}

// Exclude io.js
const NODE_JS_NAME = 'nodejs'

const getMajorVersion = function({ version }) {
  const majorVersion = major(version)

  if (majorVersion !== 0) {
    return String(majorVersion)
  }

  // `0.10` and `0.12` are major versions
  const minorVersion = minor(version)
  return `${majorVersion}.${minorVersion}`
}

// Remove future major releases that don't have any minor releases yet
const hasReleases = function({ releases }) {
  return releases.length !== 0
}

module.exports = {
  getAllMajorReleases: mGetAllMajorReleases,
}
