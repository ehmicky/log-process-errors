// Retrieve `error.stack` by re-using the original error's stack trace
export const getStack = function ({ event: { nextValue, value } }) {
  const stack = getEventStack({ nextValue, value })
  const stackA = removeStackHeader({ stack })
  return stackA
}

// Find the original error's stack trace
const getEventStack = function ({ nextValue, value }) {
  if (nextValue instanceof Error) {
    return nextValue.stack
  }

  if (value instanceof Error) {
    return value.stack
  }

  return ''
}

// Remove first line of `Error.stack` as it contains `Error.name|message`,
// which is already present in the upper error's `message`
const removeStackHeader = function ({ stack }) {
  return stack.replace(FIRST_LINE_REGEXP, '')
}

const FIRST_LINE_REGEXP = /.*\n/u
