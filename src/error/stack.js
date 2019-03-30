'use strict'

const getStack = function({ event: { nextValue, value } }) {
  const stack = getEventStack({ nextValue, value })
  const stackA = removeStackHeader({ stack })
  return stackA
}

const getEventStack = function({ nextValue, value }) {
  if (nextValue instanceof Error) {
    return nextValue.stack
  }

  if (value instanceof Error) {
    return value.stack
  }

  return new Error('').stack
}

const removeStackHeader = function({ stack }) {
  return stack.replace(FIRST_LINE_REGEXP, '')
}

// Remove first line of `Error.stack` as it contains `Error.name|message`,
// which is already present in the upper error's `message`
const FIRST_LINE_REGEXP = /.*\n/u

module.exports = {
  getStack,
}
