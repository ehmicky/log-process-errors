'use strict'

const { src, series, parallel } = require('gulp')
const jscpd = require('gulp-jscpd')

const FILES = require('../files')
const { execCommand, getWatchTask } = require('../utils')

const format = function() {
  const files = [...FILES.JAVASCRIPT].join(' ')
  return execCommand(`prettier --write --loglevel warn ${files}`)
}

// eslint-disable-next-line fp/no-mutation
format.description = 'Format files using prettier'

// We do not use `gulp-eslint` because it does not support --cache
const lint = function() {
  const files = [...FILES.JAVASCRIPT, ...FILES.MARKDOWN].join(' ')
  return execCommand(
    `eslint ${files} --max-warnings 0 --ignore-path .gitignore --fix --cache --format codeframe`,
  )
}

// eslint-disable-next-line fp/no-mutation
lint.description = 'Lint source files'

const dup = function() {
  return src([...FILES.JAVASCRIPT, ...FILES.MARKDOWN]).pipe(
    jscpd({
      verbose: true,
      blame: true,
      'min-lines': 0,
      'min-tokens': 30,
      'skip-comments': true,
    }),
  )
}

// eslint-disable-next-line fp/no-mutation
dup.description = 'Check for code duplication'

const check = series(format, lint)

const testTask = parallel(check, dup)

// eslint-disable-next-line fp/no-mutation
testTask.description = 'Lint and test the application'

const testwatch = getWatchTask(
  { JAVASCRIPT: [lint, dup], MARKDOWN: [lint, dup] },
  testTask,
)

// eslint-disable-next-line fp/no-mutation
testwatch.description = 'Lint and test the application in watch mode'

module.exports = {
  test: testTask,
  testwatch,
  check,
  format,
  lint,
  dup,
}
