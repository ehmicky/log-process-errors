'use strict'

const { mkdir } = require('fs')
const { promisify } = require('util')

const { uniq } = require('../utils')

const pMkdir = promisify(mkdir)

// Package with a scope (`@scope/name`) should be installed within `@scope`,
// which we must create
const addScopeDirs = async function({ devDependencies, nodeModules }) {
  const scopeDirs = getScopeDirs({ devDependencies })

  await Promise.all(
    scopeDirs.map(scopeDir => pMkdir(`${nodeModules}/${scopeDir}`)),
  )
}

// Retrieve all scopes
const getScopeDirs = function({ devDependencies }) {
  const scopes = devDependencies.filter(hasScope).map(getScope)
  const scopesA = uniq(scopes)
  return scopesA
}

const hasScope = function(name) {
  return name.includes('/')
}

const getScope = function(name) {
  return name.split('/')[0]
}

module.exports = {
  addScopeDirs,
}
