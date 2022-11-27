export const getError = function () {
  return new Error('message')
}

export const getRandomStackError = function () {
  // eslint-disable-next-line fp/no-mutating-assign
  return Object.assign(getError(), { stack: `  at ${Math.random()}` })
}

export const getRandomMessageError = function () {
  return new Error(String(Math.random()))
}

export const getObjectError = function (eventName) {
  return eventName === 'warning' ? 'message' : { message: 'message' }
}

export const getInvalidError = function () {
  // eslint-disable-next-line fp/no-mutating-assign
  return Object.assign(getError(), {
    name: undefined,
    message: undefined,
    stack: undefined,
  })
}
