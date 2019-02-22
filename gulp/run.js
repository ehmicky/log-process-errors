'use strict'

const { argv } = require('process')

// eslint-disable-next-line import/no-internal-modules
const execa = require('gulp-shared-tasks/dist/exec')

const EMIT_PATH = `${__dirname}/../test/helpers/emit/fire.js`

const emitEvent = async function(flags) {
  await execa('node', [
    '-r',
    'source-map-support/register',
    ...flags,
    EMIT_PATH,
    getEventName(),
  ])
}

const getEventName = function() {
  const [, , , eventName = DEFAULT_EVENT] = argv
  return eventName.replace(/^--?/u, '')
}

const DEFAULT_EVENT = '-a'

const runProd = () => emitEvent([])

// eslint-disable-next-line fp/no-mutation
runProd.description =
  'Emit a process event, e.g. `gulp emit --uncaughtException`'

const runDev = () => emitEvent(['--inspect'])

// eslint-disable-next-line fp/no-mutation
runDev.description =
  'Emit a process event in dev mode, e.g. `gulp emit --uncaughtException`'

const runDebug = () => emitEvent(['--inspect-brk'])

// eslint-disable-next-line fp/no-mutation
runDebug.description =
  'Emit a process event in debug mode, e.g. `gulp emit --uncaughtException`'

module.exports = {
  runProd,
  runDev,
  runDebug,
}
