'use strict'

module.exports = {
  ...require('./main'),
  ...require('./test'),
  ...require('./check'),
  ...require('./unit'),
  ...require('./build'),
  ...require('./pack'),
  ...require('./emit'),
}
