'use strict'

const test = require('ava')

const { repeat, startLogging, EVENTS } = require('./helpers')

const INFOS = [
  {
    name: 'uncaughtException',
    arg: () => true,
    expected: { error: true },
  },
  {
    name: 'warning',
    arg: { message: 'message', code: '500', detail: 'Detail' },
    getInfo: ({ error, error: { message } = {}, ...info }) => ({
      ...info,
      error: { ...error, message },
    }),
    expected: {
      error: {
        message: 'message',
        code: '500',
        detail: 'Detail',
        name: 'Warning',
      },
    },
  },
  {
    name: 'unhandledRejection',
    arg: () => true,
    expected: { promiseState: 'rejected', promiseValue: true },
  },
  {
    name: 'rejectionHandled',
    arg: () => true,
    expected: { promiseState: 'rejected', promiseValue: true },
  },
  {
    name: 'multipleResolves',
    arg: [['resolve', () => true], ['reject', () => false]],
    expected: {
      promiseState: 'resolved',
      promiseValue: true,
      secondPromiseState: 'rejected',
      secondPromiseValue: false,
    },
  },
]

/* eslint-disable max-nested-callbacks */
repeat(INFOS, (prefix, { name: eventName, arg, getInfo, expected }) => {
  test(`${prefix} should set info properties`, async t => {
    // When testing `multipleResolves` on Node<10
    if (EVENTS[eventName] === undefined) {
      return t.pass()
    }

    const { stopLogging, log } = startLogging({ log: 'spy', eventName })

    await EVENTS[eventName](arg)

    t.is(log.callCount, 1)

    const {
      firstCall: {
        args: [, , info],
      },
    } = log
    const infoA = getInfo === undefined ? info : getInfo(info)

    t.deepEqual(infoA, { ...expected, eventName })

    stopLogging()
  })
})
/* eslint-enable max-nested-callbacks */
