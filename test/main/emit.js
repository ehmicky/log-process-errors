import test from 'ava'
import { each } from 'test-each'

import { EVENTS } from '../helpers/events/main.js'
import { startLogging } from '../helpers/init.js'
import { removeProcessListeners } from '../helpers/remove.js'

removeProcessListeners()

each(EVENTS, ({ title }, { emit }) => {
  test(`events emitters should exist | ${title}`, (t) => {
    t.is(typeof emit, 'function')
  })

  test(`events emitters should not throw | ${title}`, async (t) => {
    const { stopLogging } = startLogging()

    await t.notThrowsAsync(emit)

    stopLogging()
  })
})
