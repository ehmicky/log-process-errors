'use strict'

const { tmpdir } = require('os')
const { rmdir, mkdir } = require('fs')
const { promisify } = require('util')

const pRmdir = promisify(rmdir)
const pMkdir = promisify(mkdir)

// `tempDir` is `/{tmpdir()}/localpack-RANDOM_ID`
const getTempDir = async function() {
  const osTempDir = tmpdir()
  const randomId = getRandomId()
  const tempDir = `${osTempDir}/${PROJECT_NAME}-${randomId}`

  await pMkdir(tempDir)

  return tempDir
}

const PROJECT_NAME = 'localpack'

const getRandomId = function() {
  return String(Math.random()).replace('.', '')
}

const cleanTempDir = async function({ tempDir }) {
  await pRmdir(tempDir)
}

module.exports = {
  getTempDir,
  cleanTempDir,
}
