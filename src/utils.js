'use strict'

const pickBy = function(object, condition) {
  const objectA = Object.entries(object)
    .filter(([key, value]) => condition(value, key))
    .map(([key, value]) => ({ [key]: value }))
  const objectB = Object.assign({}, ...objectA)
  return objectB
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
  result,
}
