'use strict'

// Retrieve `info` object representing the current error information
const getInfo = async function({
  eventName,
  error,
  promise,
  promiseValue,
  secondPromiseState,
  secondPromiseValue,
}) {
  const { promiseState, promiseValue: promiseValueA } = await parsePromise({
    eventName,
    promise,
    promiseValue,
  })

  return {
    eventName,
    error,
    promiseState,
    promiseValue: promiseValueA,
    secondPromiseState,
    secondPromiseValue,
  }
}

// Retrieve promise's resolved/rejected state and value.
const parsePromise = async function({ eventName, promise, promiseValue }) {
  // `uncaughtException` and `warning` events do not have `promise`.
  if (promise === undefined) {
    return {}
  }

  // `unhandledRejection` should not use the following code because:
  //  - we already know `promiseState` and `promiseValue`
  //  - using `try/catch` will fire `rejectionHandled`
  if (eventName === 'unhandledRejection') {
    return { promiseState: 'rejected', promiseValue }
  }

  // `rejectionHandled` and `multipleResolves` use `await promise`
  try {
    return { promiseState: 'resolved', promiseValue: await promise }
  } catch (error) {
    return { promiseState: 'rejected', promiseValue: error }
  }
}

module.exports = {
  getInfo,
}
