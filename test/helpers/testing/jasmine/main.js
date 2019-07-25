/* eslint-env jasmine */
import { EVENTS_MAP } from '../../events/main.js'
import { getOptions } from '../options.js'

const { eventName } = getOptions()

describe('should make tests fail', () => {
  it(`on ${eventName}`, () => {
    const promise = EVENTS_MAP[eventName].emit()
    // eslint-disable-next-line no-empty-function, max-nested-callbacks
    promise.catch(() => {})
  })
})
