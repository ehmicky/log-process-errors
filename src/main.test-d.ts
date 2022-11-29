import {
  expectType,
  expectAssignable,
  expectNotAssignable,
  expectError,
} from 'tsd'

import logProcessErrors, { Options, Event } from 'log-process-errors'

const undo = logProcessErrors()
expectType<void>(undo())
expectError(undo(true))

logProcessErrors({})
expectAssignable<Options>({})

expectAssignable<Event>('warning')
expectNotAssignable<Event>('other')

logProcessErrors({ onError(error: Error, event: Event) {} })
logProcessErrors({ async onError() {} })
expectError(logProcessErrors({ onError: true }))
expectError(logProcessErrors({ onError(error: boolean) {} }))
expectError(logProcessErrors({ onError: () => true }))

logProcessErrors({ exit: true })
expectError(logProcessErrors({ exit: 'true' }))
