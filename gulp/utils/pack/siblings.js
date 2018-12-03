'use strict'

const { readdir } = require('fs')
const { promisify } = require('util')
const { resolve, basename } = require('path')

const { fileExists } = require('./utils')

const pReaddir = promisify(readdir)

// Find `siblings`, i.e. `buildBase` of previous/concurrent runs
// They are used for caching purpose, i.e. copying their `node_modules` folder
// if the current run has the same dependencies.
const findSiblings = async function({ buildRoot, name, hash }) {
  const siblings = await getSiblings({ buildRoot })

  const cachedModules = await getCachedModules({ siblings, name, hash })

  return { siblings, cachedModules }
}

const getSiblings = async function({ buildRoot }) {
  const siblings = await pReaddir(buildRoot)
  const siblingsA = siblings.map(file => resolve(buildRoot, file))
  return siblingsA
}

// Find the first previous/concurrent run that has a `node_modules` folder that
// can be used for caching purposes by the current run
const getCachedModules = async function({ siblings, name, hash }) {
  const sameHashSiblings = siblings
    .filter(path => isSameHash({ path, name, hash }))
    // Once a run has finished installing `node_modules` a copy is made there
    .map(path => `${path}/modules`)
    .map(checkCachedModules)
  const sameHashSiblingsA = await Promise.all(sameHashSiblings)
  const [cachedModules] = sameHashSiblingsA
    .filter(({ exists }) => exists)
    .map(({ path }) => path)
  return cachedModules
}

// Test whether runs are targeting the same package with the same dependencies
const isSameHash = function({ path, name, hash }) {
  const file = basename(path)
  return file.startsWith(`${name}--${hash}--`)
}

const checkCachedModules = async function(path) {
  const exists = await fileExists({ path })
  return { path, exists }
}

module.exports = {
  findSiblings,
}
