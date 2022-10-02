import {
  expectType,
  expectAssignable,
  expectNotAssignable,
  expectError,
} from 'tsd'

import logProcessErrors, { Options, Reason } from './main.js'

const undo = logProcessErrors()
expectType<void>(undo())
expectError(undo(true))

logProcessErrors({})
expectAssignable<Options>({})

expectAssignable<Reason>('warning')
expectNotAssignable<Reason>('other')

logProcessErrors({ log(error: Error, reason: Reason) {} })
logProcessErrors({ async log() {} })
expectError(logProcessErrors({ log: true }))
expectError(logProcessErrors({ log(error: boolean) {} }))
expectError(logProcessErrors({ log: () => true }))

logProcessErrors({ keep: true })
expectError(logProcessErrors({ keep: 'true' }))
