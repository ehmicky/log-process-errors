'use strict'

// Like Lodash pickBy()
const pickBy = function(object, condition) {
  const pairs = Object.entries(object).filter(([key, value]) =>
    condition(value, key),
  )
  const objectA = Object.fromEntries(pairs)
  return objectA
}

// Like Lodash mapValues()
const mapValues = function(object, mapper) {
  const pairs = Object.entries(object).map(([key, value]) => [
    key,
    mapper(value, key),
  ])
  const objectA = Object.fromEntries(pairs)
  return objectA
}

// Like Lodash result(), but faster
const result = function(val, ...args) {
  if (typeof val !== 'function') {
    return val
  }

  return val(...args)
}

module.exports = {
  pickBy,
  mapValues,
  result,
}
