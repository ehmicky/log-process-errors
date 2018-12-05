'use strict'

// Like lodash _.omitBy()
const omitBy = function(object, condition) {
  const pairs = Object.entries(object)
    .filter(([key, value]) => !condition(key, value))
    .map(([key, value]) => ({ [key]: value }))
  return Object.assign({}, ...pairs)
}

// Like Lodash uniq()
const uniq = function(arr) {
  return arr.filter(isUnique)
}

const isUnique = function(value, index, arr) {
  return arr.slice(0, index).every(valueA => value !== valueA)
}

module.exports = {
  omitBy,
  uniq,
}
