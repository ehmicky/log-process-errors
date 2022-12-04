import { expectType, expectAssignable, expectNotAssignable } from 'tsd'

import logProcessErrors, { Options, Event } from 'log-process-errors'

const undo = logProcessErrors()
expectType<void>(undo())
// @ts-expect-error
undo(true)

logProcessErrors({})
expectAssignable<Options>({})

expectAssignable<Event>('warning')
expectNotAssignable<Event>('other')

logProcessErrors({ onError(error: Error, event: Event) {} })
logProcessErrors({ async onError() {} })
// @ts-expect-error
logProcessErrors({ onError: true })
// @ts-expect-error
logProcessErrors({ onError(error: boolean) {} })
// @ts-expect-error
logProcessErrors({ onError: () => true })

logProcessErrors({ exit: true })
// @ts-expect-error
logProcessErrors({ exit: 'true' })
