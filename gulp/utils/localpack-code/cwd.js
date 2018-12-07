'use strict'

const { cwd: currentCwd } = require('process')
const assert = require('assert')
const { stat } = require('fs')
const { promisify } = require('util')

const pStat = promisify(stat)

// Retrieve current directory, used to compute `packageRoot` and default
// `output`
// Can be changed with `options.cwd`
const getCwd = async function({ cwd }) {
  if (cwd === undefined) {
    return currentCwd()
  }

  await validateCwd({ cwd })

  return cwd
}

const validateCwd = async function({ cwd }) {
  assert(typeof cwd === 'string', "option 'cwd' must be a string")
  assert(cwd !== '', "option 'cwd' must not be an empty string")

  try {
    const cwdStat = await pStat(cwd)
    assert(cwdStat.isDirectory(), "option 'cwd' must not be a directory")
  } catch (error) {
    throw new Error(`option 'cwd' is invalid: ${error.message}`)
  }
}

module.exports = {
  getCwd,
}
