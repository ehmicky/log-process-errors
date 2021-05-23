// eslint-disable-next-line ava/no-ignored-test-files
import test from 'ava'

import { EVENTS_MAP } from '../events/main.js'

import { getOptions } from './options.js'

const { eventName } = getOptions()

// This test is fired twice:
//  - through `test/options/testing.js` (`OPTIONS` is defined)
//  - when the top-level `test/options/ava/register|regular.js` is required,
//    where it should be a noop (`OPTIONS` is `undefined`)
if (eventName === undefined) {
  // Otherwise `ava` complains
  test('Dummy test', (t) => {
    t.pass()
  })
} else {
  test(`should make tests fail on ${eventName}`, (t) => {
    // eslint-disable-next-line promise/prefer-await-to-then, no-empty-function
    EVENTS_MAP[eventName].emit().catch(() => {})

    t.pass()
  })
}
