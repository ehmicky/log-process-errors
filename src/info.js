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
  // `uncaughtException` and `warning` events do not have `rejected`.
  if (promise === undefined) {
    return { value }
  }

  // `unhandledRejection` should not use the following code because:
  //  - we already know `rejected` and `value`
  //  - using `try/catch` will fire `rejectionHandled`
  if (eventName === 'unhandledRejection') {
    return { rejected: true, value }
  }

  // `rejectionHandled` and `multipleResolves` use `await promise`
  try {
    return { rejected: false, value: await promise }
  } catch (error) {
    return { rejected: true, value: error }
  }
}

module.exports = {
  getInfo,
}
