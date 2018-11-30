'use strict'

// Like input.replace(oldString, newString) but for all occurences
const replaceAll = function(input, oldString, newString) {
  const regExp = escapeRegExp(oldString)
  return input.replace(new RegExp(regExp, 'gu'), newString)
}

// Escape RegExp characters
const escapeRegExp = function(string) {
  return string.replace(/[\\^$*+?.()|[\]{}]/gu, '\\$&')
}

module.exports = {
  replaceAll,
}
