import test from 'ava'
import testEach from 'test-each'

import { EVENTS } from './helpers/events/main.js'
import { normalizeCall } from './helpers/normalize.js'
import { removeProcessListeners } from './helpers/remove.js'

const LOADERS = `${__dirname}/helpers/loaders/`

removeProcessListeners()

testEach(EVENTS, ({ title }, { eventName }) => {
  test(`should work using the -r flag | ${title}`, async t => {
    t.snapshot(await normalizeCall(`node ${LOADERS}/register.js ${eventName}`))
  })

  test(`should work with --no-warnings | ${title}`, async t => {
    t.snapshot(
      await normalizeCall(
        `node --no-warnings ${LOADERS}/simple.js ${eventName}`,
      ),
    )
  })

  test(`should work with --unhandled-rejections=none | ${title}`, async t => {
    t.snapshot(
      await normalizeCall(
        `node --unhandled-rejections=none ${LOADERS}/simple.js ${eventName}`,
      ),
    )
  })

  test(`should work with --unhandled-rejections=warn | ${title}`, async t => {
    t.snapshot(
      await normalizeCall(
        `node --unhandled-rejections=warn ${LOADERS}/simple.js ${eventName}`,
      ),
    )
  })

  test(`should work with --unhandled-rejections=strict | ${title}`, async t => {
    t.snapshot(
      await normalizeCall(
        `node --unhandled-rejections=strict ${LOADERS}/simple.js ${eventName}`,
      ),
    )
  })

  test(`should work using both the -r flag and init() | ${title}`, async t => {
    t.snapshot(await normalizeCall(`node ${LOADERS}/noop.js ${eventName}`))
  })
})
