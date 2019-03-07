'use strict'

const { pickBy } = require('./utils')

// Retrieve `info` object representing the current event information
const getInfo = async function({
  eventName,
  promise,
  value,
  nextRejected,
  nextValue,
}) {
  const { rejected, value: valueA } = await parsePromise({
    eventName,
    promise,
    value,
  })

  const info = { eventName, rejected, value: valueA, nextRejected, nextValue }

  const infoA = pickBy(info, infoVal => infoVal !== undefined)
  return infoA
}

// Retrieve promise's resolved/rejected state and value.
const parsePromise = async function({ eventName, promise, value }) {
  if (NO_PROMISE_EVENTS.includes(eventName)) {
    return { value }
  }

  const { rejected, value: valueA } = await getPromiseValue({ promise })

  // `rejected` is always `true` with `rejectionHandled`, so we skip it
  if (eventName === 'rejectionHandled') {
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
  getInfo,
}
