'use strict'

const { remove } = require('fs-extra')

// Cleanup each `buildDir` after run
const removeBuildDir = async function({ buildBase, buildDir, cachedModules }) {
  const dir = cachedModules === undefined ? buildDir : buildBase
  await remove(dir)
}

// We do our best not to pollute temporary directory by files we don't need.
// On each run the following will be removed:
//  - caches that are more than 1 day old. This forces recalculating
//    dependencies versions ranges if new releases have been made.
//  - we try to keep only one buildBase per package `name`.
//     - we also need to cleanup `buildBase` when command was interrupted with
//       CTRL-C for example.
//     - however we need to keep them for at least one hour in case they are
//       currently running and their command is very long.
const removeSiblings = async function({ siblings }) {
  await Promise.all(siblings.map(removeSibling))
}

const removeSibling = function({ path, age, hasCache }) {
  if (shouldRemoveBuildBase({ age, hasCache })) {
    // `path` might not exist anymore if a parallel run removed it, but this
    // will be silently ignored by `fs-extra` (which is good)
    return remove(path)
  }

  if (shouldRemoveBuildDir({ age })) {
    return remove(`${path}/package`)
  }
}

const shouldRemoveBuildBase = function({ age, hasCache }) {
  return age > CACHE_AGE_LIMIT || (age > RUN_AGE_LIMIT && !hasCache)
}

const shouldRemoveBuildDir = function({ age }) {
  return age > RUN_AGE_LIMIT
}

// 1 day
// eslint-disable-next-line no-magic-numbers
const CACHE_AGE_LIMIT = 24 * 60 * 60 * 1e3

// 1 hour
// eslint-disable-next-line no-magic-numbers
const RUN_AGE_LIMIT = 60 * 60 * 1e3

module.exports = {
  removeBuildDir,
  removeSiblings,
}
