import logProcessErrors from '../../../src/main.js'

import { getOptions } from './options.js'

const { options } = getOptions()
logProcessErrors(options)
