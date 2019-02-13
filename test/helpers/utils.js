'use strict'

// We cannot use `src/utils.js` because it conflicts with test coverage
// TODO: use utility library instead
const mapValues = function(object, mapper) {
  const objectA = Object.entries(object).map(([key, value]) => ({
    [key]: mapper(value, key),
  }))
  const objectB = Object.assign({}, ...objectA)
  return objectB
}

module.exports = {
  mapValues,
}
