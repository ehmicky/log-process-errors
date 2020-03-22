import { env } from 'process'

const { OPTIONS } = env

export const getOptions = function () {
  if (OPTIONS === undefined) {
    return {}
  }

  const { eventName, ...options } = JSON.parse(OPTIONS)
  return { eventName, options }
}
