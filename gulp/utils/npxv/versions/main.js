'use strict'

const moize = require('moize').default

const { getAllMajorReleases } = require('./all')
const { filterReleases } = require('./filter')
const { applyRange } = require('./range')
const { pickVersions } = require('./pick')

const getNodeVersions = function({ range, old = false, lts = false } = {}) {
  const majorReleases = getAllMajorReleases()
  const majorReleasesA = filterReleases({ majorReleases, old, lts })
  const majorReleasesB = applyRange({ majorReleases: majorReleasesA, range })
  const versions = pickVersions({ majorReleases: majorReleasesB })
  return versions
}

const mGetNodeVersions = moize(getNodeVersions)

module.exports = {
  getNodeVersions: mGetNodeVersions,
}
