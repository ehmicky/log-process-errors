import { env } from 'process'

const { OPTIONS } = env

export const getOptions = function() {
  if (OPTIONS === undefined) {
    return {}
  }

  const { name, ...options } = JSON.parse(OPTIONS)
  return { name, options }
}
