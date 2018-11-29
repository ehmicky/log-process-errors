'use strict'

// Pick only one minor/patch version per major release.
// Pick the latest version for each major release, except the first one,
// where we pick the oldest version.
const pickVersions = function({ majorReleases }) {
  if (majorReleases.length === 0) {
    return []
  }

  const firstVersion = getFirstVersion(majorReleases[0])
  const versions = majorReleases.slice(1).map(getLastVersion)
  return [firstVersion, ...versions]
}

const getFirstVersion = function({ releases: [firstVersion] }) {
  return firstVersion
}

const getLastVersion = function({ releases }) {
  return releases[releases.length - 1]
}

module.exports = {
  pickVersions,
}
