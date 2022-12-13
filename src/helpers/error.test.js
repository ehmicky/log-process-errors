export const getError = () => new Error('message')

export const getRandomStackError = () =>
  // eslint-disable-next-line fp/no-mutating-assign
  Object.assign(getError(), { stack: `  at ${Math.random()}` })

export const getRandomMessageError = () => new Error(String(Math.random()))

export const getObjectError = (eventName) =>
  eventName === 'warning' ? 'message' : { message: 'message' }

export const getInvalidError = () =>
  // eslint-disable-next-line fp/no-mutating-assign
  Object.assign(getError(), {
    name: undefined,
    message: undefined,
    stack: undefined,
  })
