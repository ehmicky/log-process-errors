'use strict'

// Emit several emits in parallel
const emitEvents = async function(maxEvents, emitEvent) {
  const array = new Array(maxEvents).fill().map(() => emitEvent())
  await Promise.all(array)
}

module.exports = {
  emitEvents,
}
