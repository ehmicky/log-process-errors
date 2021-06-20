/* eslint-env jasmine */
import { boundLogProcessErrors } from './call.js'

boundLogProcessErrors()

// eslint-disable-next-line import/order, import/first
import { EVENTS_MAP } from '../events/main.js'

// eslint-disable-next-line import/first
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
