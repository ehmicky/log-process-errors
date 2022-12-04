import logProcessErrors, {
  type Options,
  type Event as LogProcessErrorEvent,
} from 'log-process-errors'
import { expectType, expectAssignable, expectNotAssignable } from 'tsd'

const undo = logProcessErrors()
expectType<void>(undo())
// @ts-expect-error
undo(true)

logProcessErrors({})
expectAssignable<Options>({})

expectAssignable<LogProcessErrorEvent>('warning')
expectNotAssignable<LogProcessErrorEvent>('other')

logProcessErrors({ onError(error: Error, event: LogProcessErrorEvent) {} })
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
