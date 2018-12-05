'use strict'

// Filter releases using options `old` and `lts`
const filterReleases = function({ majorReleases, old, lts }) {
  return majorReleases
    .filter(majorRelease => isSupported({ majorRelease, old }))
    .filter(majorRelease => isLts({ majorRelease, lts }))
}

// If `opts.old` `false` (default: false), only supported versions are kept
const isSupported = function({ majorRelease: { supported }, old }) {
  return old || supported
}

// If `opts.lts` `true` (default: false), only LTS versions are kept
const isLts = function({ majorRelease, lts }) {
  return !lts || majorRelease.lts
}

module.exports = {
  filterReleases,
}
