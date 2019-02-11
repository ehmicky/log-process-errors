'use strict'

// eslint-disable-next-line import/no-unassigned-import
require('./node_compat')

const constants = require('./constants')

module.exports = {
  ...require('./init'),
  constants,
}
