'use strict'

export default {
  // Tests are adding and remove listeners on `process` which is a global
  // object, so we cannot parallelize them.
  serial: true,
}
