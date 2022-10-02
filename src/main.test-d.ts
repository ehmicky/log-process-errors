import {
  expectType,
  expectAssignable,
  expectNotAssignable,
  expectError,
} from 'tsd'

import logProcessErrors, { Options, Level, Reason } from './main.js'

const undo = logProcessErrors()
expectType<void>(undo())
expectError(undo(true))

logProcessErrors({})
expectAssignable<Options>({})

expectAssignable<Level>('debug')
expectNotAssignable<Level>('default')
expectNotAssignable<Level>('silent')
expectNotAssignable<Level>('other')

expectAssignable<Reason>('warning')
expectNotAssignable<Reason>('other')

logProcessErrors({ log(error: Error, reason: Reason) {} })
logProcessErrors({ async log() {} })
expectError(logProcessErrors({ log: true }))
expectError(logProcessErrors({ log(error: boolean) {} }))
expectError(logProcessErrors({ log: () => true }))

logProcessErrors({ exitOn: [] })
logProcessErrors({ exitOn: ['info', 'debug'] })
expectError(logProcessErrors({ exitOn: true }))
expectError(logProcessErrors({ exitOn: [true] }))
expectError(logProcessErrors({ exitOn: ['other'] }))
