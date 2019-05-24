import { hasDuplicates } from './utils.js'

// Retrieve unique prefix for each combination of values
export const getPrefixes = function(arrays) {
  const prefixes = arrays.map(getPrefix)
  const prefixesA = fixDuplicates({ prefixes })
  return prefixesA
}

const getPrefix = function(values) {
  return values
    .map(getValuePrefix)
    .join(' ')
}

const getValuePrefix = function(value) {
  const valueA = serializeValue(value)
  return valueA.slice(0, MAX_PREFIX_LENGTH)
}

const MAX_PREFIX_LENGTH = 120

// Try to serialize value.
// Objects must have a `name` member.
const serializeValue = function(value) {
  if (value === null || typeof value !== 'object') {
    return String(value)
  }

  if (typeof value.name === 'string') {
    return value.name
  }

  return JSON.stringify(value)
}

// Add an incrementing counter if some prefixes are duplicates
// TODO: use an incrementing counter for each value instead of for all values
// at once
const fixDuplicates = function({ prefixes }) {
  if (!hasDuplicates(prefixes)) {
    return prefixes
  }

  return prefixes.map(addPrefixIndex)
}

const addPrefixIndex = function(prefix, index) {
  if (prefix.length === 0) {
    return prefix
  }

  return `${prefix} (${index})`
}
