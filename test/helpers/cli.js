import { argv } from 'process'

// eslint-disable-next-line import/order
import logProcessErrors from 'log-process-errors'
import { emit } from './events.js'

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

emitEvent()
