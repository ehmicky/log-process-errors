import test from 'ava'
import testEach from 'test-each'

import { EVENTS } from '../helpers/events/main.js'
import { startLogging } from '../helpers/init.js'
import { removeProcessListeners } from '../helpers/remove.js'

removeProcessListeners()

testEach(EVENTS, ({ name }, { emit }) => {
  test(`events emitters should exist | ${name}`, t => {
    t.is(typeof emit, 'function')
  })

  test(`events emitters should not throw | ${name}`, async t => {
    const { stopLogging } = startLogging()

    await t.notThrowsAsync(emit)

    stopLogging()
  })
})
