'use strict'

const pickBy = function(object, condition) {
  const objectA = Object.entries(object)
    .filter(([key, value]) => condition(value, key))
    .map(([key, value]) => ({ [key]: value }))
  const objectB = Object.assign({}, ...objectA)
  return objectB
}

module.exports = {
  pickBy,
}
