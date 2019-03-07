'use strict'

const test = require('ava')

const { repeat, startLogging, EVENTS } = require('./helpers')

const EVENT_OBJECTS = [
  {
    name: 'uncaughtException',
    arg: () => true,
    expected: { value: true },
  },
  {
    name: 'warning',
    arg: {
      message: 'message',
      type: 'WarningType',
      code: '500',
      detail: 'Detail',
    },
    getEvent: ({ value, value: { message } = {}, ...event }) => ({
      ...event,
      value: { ...value, message },
    }),
    expected: {
      value: {
        message: 'message',
        name: 'WarningType',
        code: '500',
        detail: 'Detail',
      },
    },
  },
  {
    name: 'unhandledRejection',
    arg: () => true,
    expected: { value: true },
  },
  {
    name: 'rejectionHandled',
    arg: () => true,
    expected: { value: true },
  },
  {
    name: 'multipleResolves',
    arg: [['resolve', () => true], ['reject', () => false]],
    expected: {
      rejected: false,
      value: true,
      nextRejected: true,
      nextValue: false,
    },
  },
]

repeat(
  EVENT_OBJECTS,
  (prefix, { name: eventName, arg, getEvent, expected }) => {
    test(`${prefix} should set event properties`, async t => {
      // When testing `multipleResolves` on Node<10
      if (EVENTS[eventName] === undefined) {
        return t.pass()
      }

      const { stopLogging, log } = startLogging({ log: 'spy', eventName })

      await EVENTS[eventName](arg)

      t.true(log.called)

      const {
        lastCall: {
          args: [, , event],
        },
      } = log
      const eventA = getEvent === undefined ? event : getEvent(event)

      t.deepEqual(eventA, { ...expected, eventName })

      stopLogging()
    })
  },
)
