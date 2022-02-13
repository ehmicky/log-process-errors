import filterObj from 'filter-obj'

// Retrieve `event` object representing the current event information
export const getEvent = async function ({
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

  const event = { rejected, value: valueA, nextRejected, nextValue }

  const eventA = filterObj(event, isDefined)
  return eventA
}

// Retrieve promise's resolved/rejected state and value.
const parsePromise = async function ({ name, promise, value }) {
  if (NO_PROMISE_EVENTS.has(name)) {
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
const NO_PROMISE_EVENTS = new Set([
  'uncaughtException',
  'warning',
  'unhandledRejection',
])

// `rejectionHandled` otherwise use `await promise`
const getPromiseValue = async function ({ promise }) {
  try {
    return { rejected: false, value: await promise }
  } catch (error) {
    return { rejected: true, value: error }
  }
}

const isDefined = function (key, value) {
  return value !== undefined
}
