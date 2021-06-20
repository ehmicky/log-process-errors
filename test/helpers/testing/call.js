import logProcessErrors from 'log-process-errors'

import { getOptions } from './options.js'

export const boundLogProcessErrors = function () {
  const { options } = getOptions()
  logProcessErrors(options)
}
