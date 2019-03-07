'use strict'

const { pickBy } = require('./utils')

// Retrieve `event` object representing the current event information
const getEvent = async function({
  name,
  promise,
  value,
  nextRejected,
  nextValue,
}) {
  const { rejected, value: valueA } = await parsePromise({
    name,
    promise,
    value,
  })

  const event = { name, rejected, value: valueA, nextRejected, nextValue }

  const eventA = pickBy(event, eventVal => eventVal !== undefined)
  return eventA
}

// Retrieve promise's resolved/rejected state and value.
const parsePromise = async function({ name, promise, value }) {
  if (NO_PROMISE_EVENTS.includes(name)) {
    return { value }
  }

  const { rejected, value: valueA } = await getPromiseValue({ promise })

  // `rejected` is always `true` with `rejectionHandled`, so we skip it
  if (name === 'rejectionHandled') {
    return { value: valueA }
  }

  return { rejected, value: valueA }
}

// Those events do not try to get the promise value.
// For `uncaughtException` and `warning`, they are not promise-specific.
// For `unhandledRejection`:
//  - we already know `rejected` and `value`
//  - using `try/catch` will fire `rejectionHandled`
const NO_PROMISE_EVENTS = ['uncaughtException', 'warning', 'unhandledRejection']

// `rejectionHandled` and `multipleResolves` otherwise use `await promise`
const getPromiseValue = async function({ promise }) {
  try {
    return { rejected: false, value: await promise }
  } catch (error) {
    return { rejected: true, value: error }
  }
}

module.exports = {
  getEvent,
}
