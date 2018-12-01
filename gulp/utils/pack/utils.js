'use strict'

const {
  access,
  constants: { R_OK, W_OK },
} = require('fs')
const { promisify } = require('util')

// Like input.replace(oldString, newString) but for all occurences
const replaceAll = function(input, oldString, newString) {
  const regExp = escapeRegExp(oldString)
  return input.replace(new RegExp(regExp, 'gu'), newString)
}

// Escape RegExp characters
const escapeRegExp = function(string) {
  return string.replace(/[\\^$*+?.()|[\]{}]/gu, '\\$&')
}

const fileExists = async function({ path, readWrite = false }) {
  // eslint-disable-next-line no-bitwise
  const flags = readWrite ? R_OK | W_OK : R_OK

  try {
    await promisify(access)(path, flags)
    return true
  } catch {
    return false
  }
}

module.exports = {
  replaceAll,
  fileExists,
}
