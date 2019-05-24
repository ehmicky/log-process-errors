/* eslint-env jasmine */
import { EVENTS } from '../../events/main.js'
import { getOptions } from '../options.js'

const { eventName } = getOptions()

describe('should make tests fail', () => {
  it(`on ${eventName}`, () => {
    // eslint-disable-next-line no-empty-function, max-nested-callbacks
    EVENTS[eventName].emitEvent().catch(() => {})
  })
})
