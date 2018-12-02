'use strict'

const {
  access,
  constants: { R_OK, W_OK },
  readdir,
} = require('fs')
const { promisify } = require('util')

const pAccess = promisify(access)
const pReaddir = promisify(readdir)

// Like input.replace(oldString, newString) but for all occurences
const replaceAll = function(input, oldString, newString) {
  const regExp = escapeRegExp(oldString)
  return input.replace(new RegExp(regExp, 'gu'), newString)
}

// Escape RegExp characters
const escapeRegExp = function(string) {
  return string.replace(/[\\^$*+?.()|[\]{}]/gu, '\\$&')
}

// We are replacing strings inside JSON files, so we need to escape " and \
const escapeJsonString = function(string) {
  return string.replace(/(["\\])/gu, '\\$1')
}

const fileExists = async function({ path, readWrite = false }) {
  // eslint-disable-next-line no-bitwise
  const flags = readWrite ? R_OK | W_OK : R_OK

  try {
    await pAccess(path, flags)
    return true
  } catch {
    return false
  }
}

// Retrieve all JSON files from a given directory
const listFiles = async function(dir, extension) {
  const dirExists = await fileExists({ path: dir })

  if (!dirExists) {
    return []
  }

  const files = await pReaddir(dir)
  const filesA = files
    .filter(file => file.endsWith(extension))
    .map(file => `${dir}/${file}`)
  return filesA
}

module.exports = {
  replaceAll,
  escapeJsonString,
  fileExists,
  listFiles,
}
