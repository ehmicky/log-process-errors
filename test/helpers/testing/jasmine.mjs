/* eslint-env jasmine */
// eslint-disable-next-line import/no-unassigned-import
import './call.js'

// eslint-disable-next-line import/order
import { EVENTS_MAP } from '../events/main.js'

import { getOptions } from './options.js'

const { eventName } = getOptions()

describe('should make tests fail', () => {
  // eslint-disable-next-line max-nested-callbacks
  it(`on ${eventName}`, () => {
    const promise = EVENTS_MAP[eventName].emit()
    // eslint-disable-next-line promise/prefer-await-to-then, no-empty-function, max-nested-callbacks
    promise.catch(() => {})
  })
})
