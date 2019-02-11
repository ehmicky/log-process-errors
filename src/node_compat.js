'use strict'

// This is a polyfill for methods only supported by Node 11
// TODO: use Babel instead

// eslint-disable-next-line fp/no-mutation, no-extend-native, func-names,
Array.prototype.flatMap = function(...args) {
  // eslint-disable-next-line fp/no-this
  return [].concat(...this.map(...args))
}
