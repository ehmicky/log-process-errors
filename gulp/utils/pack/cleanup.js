'use strict'

const { stat } = require('fs')
const { promisify } = require('util')
const { basename } = require('path')

const { remove } = require('fs-extra')

const { addErrorHandler } = require('./utils')

const pStat = promisify(stat)

// Cleanup each `buildDir` after run
const removeBuildDir = async function({ buildDir }) {
  await remove(buildDir)
}

// We do our best not to pollute temporary directory by files we don't need.
// On each run the following will be removed:
//  - files that are more than 1 day old. This forces recalculating dependencies
//    versions ranges if new releases have been made.
//  - we try to keep only one buildDir per package `name`. However we need to
//    keep them for at least one hour in case they are currently running and
//    their command is very long.
const removeSiblings = async function({ siblings, name }) {
  await Promise.all(siblings.map(path => removeSibling({ path, name })))
}

const removeSibling = async function({ path, name }) {
  const ctime = await eStatFile({ path })

  if (!shouldRemove({ ctime, path, name })) {
    return
  }

  // `path` might not exist anymore if a parallel run removed it, but this will
  // be silently ignored by `fs-extra` (which is good)
  await remove(path)
}

const statFile = async function({ path }) {
  const { ctime } = await pStat(path)
  return ctime
}

// The file might have been removed by a parallel run, in which case we should
// ignore it
const statFileHandler = function(error) {
  if (error.code === 'ENOENT') {
    return
  }

  throw error
}

const eStatFile = addErrorHandler(statFile, statFileHandler)

const shouldRemove = function({ ctime, path, name }) {
  if (ctime === undefined) {
    return false
  }

  const age = Date.now() - ctime

  return age > AGE_LIMIT || hasSameName({ path, age, name })
}

const hasSameName = function({ path, age, name }) {
  const file = basename(path)

  return file.startsWith(`${name}--`) && age > SAME_NAME_AGE_LIMIT
}

// 1 day
// eslint-disable-next-line no-magic-numbers
const AGE_LIMIT = 24 * 60 * 60 * 1e3

// 1 hour
// eslint-disable-next-line no-magic-numbers
const SAME_NAME_AGE_LIMIT = 60 * 60 * 1e3

module.exports = {
  removeBuildDir,
  removeSiblings,
}
