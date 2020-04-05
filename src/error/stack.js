// Retrieve `error.stack` by re-using the original error's stack trace
// Remove first line of `Error.stack` as it contains `Error.name|message`,
// which is already present in the upper error's `message`
export const getStack = function({ stack = '' }) {
  return stack.replace(FIRST_LINE_REGEXP, '')
}

const FIRST_LINE_REGEXP = /.*\n/u
