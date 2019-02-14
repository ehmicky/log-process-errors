'use strict'

const { pickBy } = require('./utils')

// Retrieve `info` object representing the current error information
const getInfo = async function({
  eventName,
  error,
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

  const info = {
    eventName,
    error,
    rejected,
    value: valueA,
    nextRejected,
    nextValue,
  }

  const infoA = pickBy(info, value => value !== undefined)
  return infoA
}

// Retrieve promise's resolved/rejected state and value.
const parsePromise = async function({ eventName, promise, value }) {
  // `uncaughtException` and `warning` events do not have `promise`.
  if (promise === undefined) {
    return {}
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
