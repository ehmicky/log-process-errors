'use strict'

const { argv } = require('process')

const gulpExeca = require('../exec')

const emitEvent = function(flags) {
  const eventName = getEventName()
  return gulpExeca(`node --no-warnings ${flags}${EMIT_PATH} ${eventName}`)
}

const getEventName = function() {
  const [, , , eventName] = argv
  return eventName.replace('--', '')
}

const EMIT_PATH = './examples/emit.js'

const emit = emitEvent.bind(null, '')

// eslint-disable-next-line fp/no-mutation
emit.description =
  'Emit a process event. The event name (or just its first letter) must be passed as option, e.g. `gulp emit --uncaughtException`'

const debug = emitEvent.bind(null, '--inspect-brk ')

// eslint-disable-next-line fp/no-mutation
debug.description =
  'Emit a process event in debugging mode. The event name (or just its first letter) must be passed as option, e.g. `gulp emit --uncaughtException`'

module.exports = {
  emit,
  debug,
}
