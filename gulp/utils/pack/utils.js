'use strict'

const {
  access,
  constants: { R_OK, W_OK },
  readdir,
} = require('fs')
const { promisify } = require('util')

const pAccess = promisify(access)
const pReaddir = promisify(readdir)

// Like input.replace(oldString, newString) but for all occurences
const replaceAll = function(input, oldString, newString) {
  const regExp = escapeRegExp(oldString)
  return input.replace(new RegExp(regExp, 'gu'), newString)
}

// Escape RegExp characters
const escapeRegExp = function(string) {
  return string.replace(/[\\^$*+?.()|[\]{}]/gu, '\\$&')
}

// We are replacing strings inside JSON files, so we need to escape " and \
const escapeJsonString = function(string) {
  return string.replace(/(["\\])/gu, '\\$1')
}

const fileExists = async function({ path, readWrite = false }) {
  // eslint-disable-next-line no-bitwise
  const flags = readWrite ? R_OK | W_OK : R_OK

  try {
    await pAccess(path, flags)
    return true
  } catch {
    return false
  }
}

// Retrieve all JSON files from a given directory
const listFiles = async function(dir, extension) {
  const dirExists = await fileExists({ path: dir })

  if (!dirExists) {
    return []
  }

  const files = await pReaddir(dir)
  const filesA = files
    .filter(file => file.endsWith(extension))
    .map(file => `${dir}/${file}`)
  return filesA
}

// Sort an object's keys to canonicalize it
const sortKeys = function(object) {
  // eslint-disable-next-line fp/no-mutating-methods
  const objectA = Object.keys(object)
    .sort()
    .map(key => ({ [key]: object[key] }))
  const objectB = Object.assign({}, ...objectA)
  return objectB
}

// Wraps a functor so it does not modify a function `name`, `length`, etc.
const keepProps = function(functor) {
  return (originalFunc, ...args) => {
    const wrappedFunc = functor(originalFunc, ...args)

    copyProperties({ originalFunc, wrappedFunc })

    return wrappedFunc
  }
}

const copyProperties = function({ originalFunc, wrappedFunc }) {
  Reflect.ownKeys(originalFunc).forEach(propName =>
    copyProperty({ originalFunc, wrappedFunc, propName }),
  )
}

const copyProperty = function({ originalFunc, wrappedFunc, propName }) {
  const prop = Object.getOwnPropertyDescriptor(originalFunc, propName)
  // eslint-disable-next-line fp/no-mutating-methods
  Object.defineProperty(wrappedFunc, propName, prop)
}

// Wrap a function with a error handler
// Allow passing an empty error handler, i.e. ignoring any error thrown
// eslint-disable-next-line no-empty-function
const addErrorHandler = function(func, errorHandler = () => {}) {
  return errorHandledFunc.bind(null, func, errorHandler)
}

const kAddErrorHandler = keepProps(addErrorHandler)

const errorHandledFunc = function(func, errorHandler, ...args) {
  try {
    const retVal = func(...args)

    // Works for async functions as well
    // eslint-disable-next-line promise/prefer-await-to-then
    return retVal && typeof retVal.then === 'function'
      ? retVal.catch(error => errorHandler(error, ...args))
      : retVal
  } catch (error) {
    return errorHandler(error, ...args)
  }
}

module.exports = {
  replaceAll,
  escapeJsonString,
  fileExists,
  listFiles,
  sortKeys,
  addErrorHandler: kAddErrorHandler,
}
