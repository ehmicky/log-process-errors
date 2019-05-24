/* eslint-env mocha */
import { EVENTS } from '../../emit/main.js'
import { getOptions } from '../options.js'

const { eventName } = getOptions()

describe('should make tests fail', function testSuite() {
  it(`on ${eventName}`, () => {
    // eslint-disable-next-line no-empty-function, max-nested-callbacks
    EVENTS[eventName].emitEvent().catch(() => {})
  })
})
