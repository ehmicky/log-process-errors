// Like Lodash mapValues()
export const mapValues = function(object, mapper) {
  const pairs = Object.entries(object).map(([key, value]) => [
    key,
    mapper(value, key),
  ])
  return Object.fromEntries(pairs)
}

// Like Lodash result(), but faster
export const result = function(val, ...args) {
  if (typeof val !== 'function') {
    return val
  }

  return val(...args)
}
