import {
  expectType,
  expectAssignable,
  expectNotAssignable,
  expectError,
} from 'tsd'

import logProcessErrors, {
  Options,
  Level,
  LevelOption,
  ErrorName,
  Undo,
} from './main.js'

const undo = logProcessErrors()
expectType<Undo>(undo)
expectType<void>(undo())
expectError(undo(true))

logProcessErrors({})
expectAssignable<Options>({})

expectAssignable<Level>('debug')
expectNotAssignable<Level>('default')
expectNotAssignable<Level>('silent')
expectNotAssignable<Level>('other')

expectAssignable<LevelOption>('debug')
expectAssignable<LevelOption>('default')
expectAssignable<LevelOption>('silent')
expectNotAssignable<LevelOption>('other')

expectAssignable<ErrorName>('warning')
expectNotAssignable<ErrorName>('other')

logProcessErrors({ log(error: Error, level: Level, originalError: Error) {} })
logProcessErrors({ async log() {} })
expectError(logProcessErrors({ log: true }))
expectError(logProcessErrors({ log(error: boolean) {} }))
expectError(logProcessErrors({ log: () => true }))

logProcessErrors({ level: {} })
logProcessErrors({ level: { warning: 'info' } })
logProcessErrors({ level: { default: 'info' } })
logProcessErrors({ level: { warning: 'default' } })
logProcessErrors({ level: { warning: 'silent' } })
logProcessErrors({ level: { warning: (error: Error) => 'silent' } })
expectError(logProcessErrors({ level: true }))
expectError(logProcessErrors({ level: { warning: () => true } }))
expectError(logProcessErrors({ level: { warning: 'other' } }))
expectError(logProcessErrors({ level: { other: 'info' } }))
expectError(
  logProcessErrors({ level: { warning: (error: boolean) => 'silent' } }),
)

logProcessErrors({ exitOn: [] })
logProcessErrors({ exitOn: ['info', 'debug'] })
expectError(logProcessErrors({ exitOn: true }))
expectError(logProcessErrors({ exitOn: [true] }))
expectError(logProcessErrors({ exitOn: ['other'] }))
