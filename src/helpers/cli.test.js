import { argv } from 'node:process'

// eslint-disable-next-line import/order
import logProcessErrors from 'log-process-errors'
import { emit } from './events.test.js'

const emitEvent = async function () {
  const stopLogging = logProcessErrors({
    onError(error) {
      // eslint-disable-next-line no-restricted-globals, no-console
      console.log(error.message)
    },
    exit: false,
  })

  try {
    await emit(argv[2])
  } finally {
    stopLogging()
  }
}

await emitEvent()
