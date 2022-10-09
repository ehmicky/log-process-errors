import {
  expectType,
  expectAssignable,
  expectNotAssignable,
  expectError,
} from 'tsd'

import logProcessErrors, { Options, Event } from './main.js'

const undo = logProcessErrors()
expectType<void>(undo())
expectError(undo(true))

logProcessErrors({})
expectAssignable<Options>({})

expectAssignable<Event>('warning')
expectNotAssignable<Event>('other')

logProcessErrors({ log(error: Error, event: Event) {} })
logProcessErrors({ async log() {} })
expectError(logProcessErrors({ log: true }))
expectError(logProcessErrors({ log(error: boolean) {} }))
expectError(logProcessErrors({ log: () => true }))

logProcessErrors({ exit: true })
expectError(logProcessErrors({ exit: 'true' }))
