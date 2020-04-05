// If event is an error, retrieve static properties except `name` and `message`
export const getEventProps = function ({ nextValue, value }) {
  if (nextValue instanceof Error) {
    return getErrorProps(nextValue)
  }

  if (value instanceof Error) {
    return getErrorProps(value)
  }

  return {}
}

const getErrorProps = function (error) {
  return { stack: error.stack, ...error }
}
