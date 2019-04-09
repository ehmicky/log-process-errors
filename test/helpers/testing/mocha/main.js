import { EVENTS } from '../../emit/main.js'
import { getOptions } from '../options.js'

const { name } = getOptions()

// eslint-disable-next-line no-undef
describe('should make tests fail', function testSuite() {
  // eslint-disable-next-line no-undef
  it(`on ${name}`, () => {
    // eslint-disable-next-line no-empty-function, max-nested-callbacks
    EVENTS[name]().catch(() => {})
  })
})
