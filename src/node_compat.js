'use strict'

// Polyfills/ponyfills for methods only supported by Node 11
// TODO: use Babel instead

// eslint-disable-next-line fp/no-mutation, no-extend-native, func-names,
Array.prototype.flatMap = function(...args) {
  // eslint-disable-next-line fp/no-this
  return [].concat(...this.map(...args))
}

// Like `Object.fromEntries()`
const fromEntries = function(pairs) {
  const pairsA = pairs.map(([key, value]) => ({ [key]: value }))
  return Object.assign({}, ...pairsA)
}

module.exports = {
  fromEntries,
}
