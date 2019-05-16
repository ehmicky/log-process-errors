/* eslint-env jasmine */
import { EVENTS } from '../../emit/main.js'
import { getOptions } from '../options.js'

const { name } = getOptions()

describe('should make tests fail', () => {
  it(`on ${name}`, () => {
    // eslint-disable-next-line no-empty-function, max-nested-callbacks
    EVENTS[name]().catch(() => {})
  })
})
