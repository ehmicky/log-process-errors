'use strict'

// Ava does not allow defining in `./helpers`. However this test is about
// Ava testing itself (its behavior when `log-process-errors` is used), i.e.
// this is called through a child process and must be defined in `./helpers`.
// We solve this by `require()` a helper from this file.
const {
  env: { EVENT_NAME },
} = require('process')

const test = require('ava')

// This file should not be fired as a normal test file, it's actually a helper
if (EVENT_NAME === undefined) {
  // Otherwise `ava` complains
  test('Dummy test', t => t.pass())
} else {
  // We do not require `./helpers` so that `./helpers/remove` is not executed.
  // eslint-disable-next-line import/no-unassigned-import
  require('./helpers/test_opt/ava')
}
