'use strict'

const test = require('ava')

const { repeat, startLogging, EVENTS } = require('./helpers')

const INFOS = [
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
    getInfo: ({ value, value: { message } = {}, ...info }) => ({
      ...info,
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

repeat(INFOS, (prefix, { name: eventName, arg, getInfo, expected }) => {
  test(`${prefix} should set info properties`, async t => {
    // When testing `multipleResolves` on Node<10
    if (EVENTS[eventName] === undefined) {
      return t.pass()
    }

    const { stopLogging, log } = startLogging({ log: 'spy', eventName })

    await EVENTS[eventName](arg)

    t.true(log.called)

    const {
      lastCall: {
        args: [, , info],
      },
    } = log
    const infoA = getInfo === undefined ? info : getInfo(info)

    t.deepEqual(infoA, { ...expected, eventName })

    stopLogging()
  })
})
