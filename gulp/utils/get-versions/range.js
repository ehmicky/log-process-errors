'use strict'

const assert = require('assert')

const { validRange, satisfies } = require('semver')
const pkgDir = require('pkg-dir')
const moize = require('moize').default

// Only keep versions satisfying `opts.range`
const applyRange = function({ majorReleases, range = mGetDefaultRange() }) {
  if (range === undefined) {
    return majorReleases
  }

  const rangeA = normalizeRange({ range })

  const majorReleasesA = applyOnMajorReleases({ majorReleases, range: rangeA })
  return majorReleasesA
}

// `opts.range` defaults to `engines.node` field in `package.json`
const getDefaultRange = function() {
  const packageRoot = pkgDir.sync()

  if (packageRoot === null) {
    return
  }

  // eslint-disable-next-line import/no-dynamic-require
  const { engines: { node } = {} } = require(`${packageRoot}/package.json`)
  return node
}

const mGetDefaultRange = moize(getDefaultRange)

const normalizeRange = function({ range }) {
  const rangeA = validRange(range)
  assert(rangeA !== null, `Invalid Node.js versions range: ${range}`)
  return rangeA
}

// Filter releases using `opts.range` and only keep major releases that have
// at lease one minor/patch release.
const applyOnMajorReleases = function({ majorReleases, range }) {
  return majorReleases
    .map(majorRelease => applyOnMajorRelease({ majorRelease, range }))
    .filter(hasReleases)
}

const applyOnMajorRelease = function({
  majorRelease,
  majorRelease: { releases },
  range,
}) {
  const releasesA = releases.filter(version => satisfies(version, range))
  return { ...majorRelease, releases: releasesA }
}

const hasReleases = function({ releases }) {
  return releases.length !== 0
}

module.exports = {
  applyRange,
}
