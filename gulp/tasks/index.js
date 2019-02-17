'use strict'

module.exports = {
  ...require('./main'),
  ...require('./test'),
  ...require('./check'),
  ...require('./unit'),
  ...require('./coverage'),
  ...require('./build'),
}
