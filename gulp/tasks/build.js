'use strict'

const { series } = require('gulp')

const { getWatchTask } = require('../utils')
const { TRANSPILED } = require('../files')
const gulpExeca = require('../exec')

const babel = function() {
  const promises = TRANSPILED.map(dir =>
    gulpExeca(
      `babel ${dir} --out-dir dist/${dir} --copy-files --delete-dir-on-start --source-maps --no-comments --minified --retain-lines`,
    ),
  )
  return Promise.all(promises)
}

const build = series(babel)

// eslint-disable-next-line fp/no-mutation
build.description = 'Build source files'

const buildwatch = getWatchTask({ TRANSPILED: build }, build)

// eslint-disable-next-line fp/no-mutation
buildwatch.description = 'Build source files in watch mode'

module.exports = {
  build,
  buildwatch,
}
