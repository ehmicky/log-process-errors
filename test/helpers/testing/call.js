// eslint-disable-next-line node/no-extraneous-import
import logProcessErrors from 'log-process-errors'

import { getOptions } from './options.js'

const { options } = getOptions()
logProcessErrors(options)
