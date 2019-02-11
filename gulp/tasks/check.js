'use strict'

const { src, series, parallel } = require('gulp')
const jscpd = require('gulp-jscpd')

const FILES = require('../files')
const { getWatchTask } = require('../utils')
const gulpExeca = require('../exec')

const format = () =>
  gulpExeca(`prettier --write --loglevel warn ${FILES.CHECK.join(' ')}`)

// We do not use `gulp-eslint` because it does not support --cache
const eslint = function() {
  const files = FILES.CHECK.map(pattern => `"${pattern}"`).join(' ')
  return gulpExeca(
    `eslint ${files} --ignore-path .gitignore --fix --cache --format codeframe --max-warnings 0 --report-unused-disable-directives`,
  )
}

const lint = series(format, eslint)

// eslint-disable-next-line fp/no-mutation
lint.description = 'Lint source files'

const dup = () =>
  src(FILES.CHECK).pipe(
    jscpd({
      verbose: true,
      blame: true,
      'min-lines': 0,
      'min-tokens': 30,
      'skip-comments': true,
    }),
  )

// eslint-disable-next-line fp/no-mutation
dup.description = 'Check for code duplication'

const audit = async () => {
  // Older `npm` versions do not have this command
  try {
    await gulpExeca('npm audit -h', { stdout: 'ignore' })
  } catch {
    return
  }

  await gulpExeca('npm audit', { stdout: 'ignore' })
}

// eslint-disable-next-line fp/no-mutation
audit.description = 'Check for security vulnerabilities'

const outdated = () => gulpExeca('npm outdated')

// eslint-disable-next-line fp/no-mutation
outdated.description = 'Report outdated dependencies'

const check = parallel(lint, dup, audit, outdated)

// eslint-disable-next-line fp/no-mutation
check.description = 'Lint and check for code duplication'

const checkwatch = getWatchTask({ CHECK: check }, check)

// eslint-disable-next-line fp/no-mutation
checkwatch.description = 'Lint and test the application in watch mode'

module.exports = {
  check,
  checkwatch,
  lint,
  dup,
  audit,
  outdated,
}
