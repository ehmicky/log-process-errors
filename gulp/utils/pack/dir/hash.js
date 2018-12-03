'use strict'

const { createHash } = require('crypto')

const moize = require('moize').default

const { sortKeys } = require('../utils')

// Compute a hash based on which dependencies (and their versions) will be
// installed by `npm install --only=prod` (so that command can be cached).
const getPackageHash = function({ packageJson }) {
  const properties = HASH_PROPERTIES.map(propName =>
    getHashProperty({ propName, packageJson }),
  )
  const propertiesA = Object.assign({}, ...properties)
  const hash = hashObject(propertiesA)
  return hash
}

const HASH_PROPERTIES = [
  'dependencies',
  'optionalDependencies',
  'bundledDependencies',
]

const getHashProperty = function({ propName, packageJson }) {
  const value = packageJson[propName] || {}
  // Reordering properties should not change the hash
  // eslint-disable-next-line fp/no-mutating-methods
  const valueA = Array.isArray(value) ? value.sort() : sortKeys(value)
  return { [propName]: valueA }
}

const hashObject = function(object) {
  const objectA = JSON.stringify(object)
  const hash = sha1Hash(objectA)
  return hash
}

const sha1Hash = function(value) {
  return createHash('sha1')
    .update(value)
    .digest('hex')
}

const mGetPackageHash = moize(getPackageHash)

module.exports = {
  getPackageHash: mGetPackageHash,
}
