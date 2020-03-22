import mapObj from 'map-obj'

// Like Lodash mapValues()
export const mapValues = function (object, mapper) {
  return mapObj(object, (key, value) => [key, mapper(value, key)])
}

// Like Lodash result(), but faster
export const result = function(val, ...args) {
  if (typeof val !== 'function') {
    return val
  }

  return val(...args)
}
