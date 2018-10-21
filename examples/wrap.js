'use strict'

const { promisify } = require('util')

const logProcessErrors = require('../custom')

const wrapFunction = async function(fireFunc) {
  const stopLogging = logProcessErrors({ exitOn: [] })

  await fireFunc()

  await promisify(setImmediate)()

  stopLogging()
}

module.exports = {
  wrapFunction,
}
