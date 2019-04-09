/* eslint-disable ava/no-ignored-test-files */
import test from 'ava'

import { EVENTS } from '../emit/main.js'

import { getOptions } from './options.js'

const { name } = getOptions()

// This test is fired twice:
//  - through `test/options/testing.js` (`OPTIONS` is defined)
//  - when the top-level `test/options/ava/register|regular.js` is required,
//    where it should be a noop (`OPTIONS` is `undefined`)
if (name === undefined) {
  // Otherwise `ava` complains
  test('Dummy test', t => t.pass())
} else {
  test(`should make tests fail on ${name}`, t => {
    // eslint-disable-next-line no-empty-function
    EVENTS[name]().catch(() => {})

    t.pass()
  })
}
/* eslint-enable ava/no-ignored-test-files */
