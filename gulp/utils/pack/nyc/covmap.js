'use strict'

const { readFile, writeFile } = require('fs')
const { normalize } = require('path')
const { promisify } = require('util')

const { replaceAll, listFiles, escapeJsonString } = require('../utils')

const pReadFile = promisify(readFile)
const pWriteFile = promisify(writeFile)

// Replace coverage maps paths from `buildDir` to `packageRoot`
const replaceCovMaps = async function({ packageRoot, buildDir, avaTempDir }) {
  const files = await getCovMapsFiles({ avaTempDir })
  const promises = files.map(file =>
    replaceCovMap({ file, packageRoot, buildDir }),
  )
  await Promise.all(promises)
}

const getCovMapsFiles = async function({ avaTempDir }) {
  const [files, processTreeFiles] = await Promise.all([
    listFiles(avaTempDir, '.json'),
    // Used by `nyc --show-process-tree`
    listFiles(`${avaTempDir}/processinfo`, '.json'),
  ])
  return [...files, ...processTreeFiles]
}

const replaceCovMap = async function({ file, packageRoot, buildDir }) {
  // For Windows
  const buildDirA = normalize(buildDir)

  // Because we are replacing a non-parsed JSON file
  const buildDirB = escapeJsonString(buildDirA)
  const packageRootA = escapeJsonString(packageRoot)

  const covMap = await pReadFile(file, { encoding: 'utf-8' })
  const covMapA = replaceAll(covMap, buildDirB, packageRootA)
  await pWriteFile(file, covMapA, { encoding: 'utf-8' })
}

module.exports = {
  replaceCovMaps,
}
