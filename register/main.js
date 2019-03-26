// eslint-disable-next-line filenames/match-exported
'use strict'

// We need to use this syntax to avoid linting issues: different ESLint
// rules are reported whether `build` is present or not.
const pkgDir = '..'
// eslint-disable-next-line import/no-dynamic-require
const logProcessErrors = require(pkgDir)

module.exports = logProcessErrors
