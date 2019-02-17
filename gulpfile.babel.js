// eslint-disable-next-line filenames/match-regex
'use strict'

const { argv } = require('process')

const gulpTasks = require('./gulp')
// eslint-disable-next-line import/no-internal-modules
const gulpExeca = require('./gulp/exec')

const EMIT_PATH = `${__dirname}/test/helpers/emit/fire.js`

const emitEvent = function(flags) {
  const eventName = getEventName()
  return gulpExeca(
    `node -r source-map-support/register ${flags}${EMIT_PATH} ${eventName}`,
  )
}

const getEventName = function() {
  const [, , , eventName = DEFAULT_EVENT] = argv
  return eventName.replace(/^--?/u, '')
}

const DEFAULT_EVENT = '-a'

const start = emitEvent.bind(null, '')

// eslint-disable-next-line fp/no-mutation
start.description =
  'Emit a process event. The event name (or just its first letter) must be passed as option, e.g. `gulp emit --uncaughtException`'

const dev = emitEvent.bind(null, '--inspect ')

// eslint-disable-next-line fp/no-mutation
dev.description =
  'Emit a process event in dev mode. The event name (or just its first letter) must be passed as option, e.g. `gulp emit --uncaughtException`'

const debug = emitEvent.bind(null, '--inspect-brk ')

// eslint-disable-next-line fp/no-mutation
debug.description =
  'Emit a process event in debug mode. The event name (or just its first letter) must be passed as option, e.g. `gulp emit --uncaughtException`'

module.exports = {
  ...gulpTasks,
  start,
  dev,
  debug,
}
