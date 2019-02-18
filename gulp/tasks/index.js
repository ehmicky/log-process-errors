'use strict'

module.exports = {
  ...require('./build'),
  ...require('./test'),
  ...require('./check'),
  ...require('./unit'),
  ...require('./coverage'),
}
