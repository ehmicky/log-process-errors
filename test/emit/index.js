'use strict'

module.exports = {
  ...require('./uncaught_exception'),
  ...require('./unhandled_rejection'),
  ...require('./rejection_handled'),
  ...require('./multiple_resolves'),
  ...require('./warning'),
  ...require('./all'),
}
