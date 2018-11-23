'use strict'

const { series } = require('gulp')

const { getWatchTask } = require('../utils')
const { BUILD_SRC, BUILD_DIST } = require('../files')
const gulpExeca = require('../exec')

const { pack } = require('./pack')

const babel = () =>
  gulpExeca(
    `babel ${BUILD_SRC} --out-dir ${BUILD_DIST} --copy-files --delete-dir-on-start --source-maps --no-comments --minified --retain-lines`,
  )

const build = series(babel, pack)

// eslint-disable-next-line fp/no-mutation
build.description = 'Build source files'

const buildwatch = getWatchTask({ BUILD_SRC: build }, build)

// eslint-disable-next-line fp/no-mutation
buildwatch.description = 'Build source files in watch mode'

module.exports = {
  build,
  buildwatch,
}
