'use strict'

const { getError } = require('./error')
const { getMessage } = require('./message')

// Generic event handler for all events.
const handleEvent = async function({ handlerFunc, eventName, error, promise }) {
  const { promiseState, promiseValue } = await parsePromise({ promise })
  const errorA = getError({ error, promiseValue })
  const message = getMessage({
    eventName,
    promiseState,
    promiseValue,
    error: errorA,
  })

  handlerFunc({ eventName, promiseState, promiseValue, error: errorA, message })
}

// Retrieve promise's resolved/rejected state and value.
const parsePromise = async function({ promise }) {
  // `uncaughtException` and `warning` events do not have `promise`.
  if (promise === undefined) {
    return {}
  }

  try {
    const promiseValue = await promise
    return { promiseState: 'resolved', promiseValue }
  } catch (error) {
    return { promiseState: 'rejected', promiseValue: error }
  }
}

module.exports = {
  handleEvent,
}
