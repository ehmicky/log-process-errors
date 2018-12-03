'use strict'

const { readdir, stat } = require('fs')
const { promisify } = require('util')
const { resolve, basename } = require('path')

const { addErrorHandler, fileExists } = require('./utils')

const pStat = promisify(stat)

const pReaddir = promisify(readdir)

// Find `siblings`, i.e. `buildBase` of previous/concurrent runs
// They are used for caching purpose, i.e. copying their `node_modules` folder
// if the current run has the same dependencies.
const findSiblings = async function({ buildRoot, name, hash }) {
  const siblings = await getSiblings({ buildRoot })

  const cachedModules = getCachedModules({ siblings, name, hash })

  return { siblings, cachedModules }
}

const getSiblings = async function({ buildRoot }) {
  const siblings = await pReaddir(buildRoot)
  const siblingsA = siblings.map(file => normalizeSibling({ buildRoot, file }))
  const siblingsB = await Promise.all(siblingsA)
  const siblingsC = siblingsB.filter(({ age }) => age !== undefined)
  return siblingsC
}

const normalizeSibling = async function({ buildRoot, file }) {
  const path = resolve(buildRoot, file)
  const [age, hasCache] = await Promise.all([
    eStatFile({ path }),
    fileExists({ path: `${path}/modules` }),
  ])
  return { path, age, hasCache }
}

const statFile = async function({ path }) {
  const { ctime } = await pStat(path)
  const age = Date.now() - ctime
  return age
}

// The file might have been removed by a parallel run, which is ok
const statFileHandler = function(error) {
  if (error.code === 'ENOENT') {
    return
  }

  throw error
}

const eStatFile = addErrorHandler(statFile, statFileHandler)

// Find the first previous/concurrent run that has a `node_modules` folder that
// can be used for caching purposes by the current run
const getCachedModules = function({ siblings, name, hash }) {
  const sameHashSibling = siblings.find(({ path, hasCache }) =>
    hasCachedModules({ path, hasCache, name, hash }),
  )

  if (sameHashSibling === undefined) {
    return
  }

  return `${sameHashSibling.path}/modules`
}

// Test whether runs are targeting the same package with the same dependencies
// and a cache is available.
const hasCachedModules = function({ path, hasCache, name, hash }) {
  const file = basename(path)
  return file.startsWith(`${name}--${hash}--`) && hasCache
}

module.exports = {
  findSiblings,
}
