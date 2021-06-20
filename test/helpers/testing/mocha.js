/* eslint-env mocha */
import { boundLogProcessErrors } from './call.js'

boundLogProcessErrors()

// eslint-disable-next-line import/order, import/first
import { EVENTS_MAP } from '../events/main.js'

// eslint-disable-next-line import/first
import { getOptions } from './options.js'

const { eventName } = getOptions()

describe('should make tests fail', function testSuite() {
  it(`on ${eventName}`, () => {
    // eslint-disable-next-line promise/prefer-await-to-then, no-empty-function, max-nested-callbacks
    EVENTS_MAP[eventName].emit().catch(() => {})
  })
})
