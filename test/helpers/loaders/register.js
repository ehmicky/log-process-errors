'use strict'

const { argv } = require('process')

// We use `require()` instead of the `-r` flag because Istanbul does not cover
// files loaded with the `-r` flag:
//   https://github.com/istanbuljs/istanbuljs.github.io/issues/144
// eslint-disable-next-line import/no-unassigned-import, node/no-missing-require, import/no-unresolved
require('../../../../register')

const { stubStackTrace } = require('../stack')
const { EVENTS } = require('../emit')

stubStackTrace()

const [, , name] = argv
EVENTS[name]()
