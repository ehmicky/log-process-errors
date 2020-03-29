// Like Lodash result(), but faster
export const result = function (val, ...args) {
  if (typeof val !== 'function') {
    return val
  }

  return val(...args)
}
