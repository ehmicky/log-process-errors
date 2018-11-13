'use strict'

const execa = require('execa')
const PluginError = require('plugin-error')

// Execute a shell command
const exec = async function(command, opts = {}) {
  const optsA = addStdio({ opts })

  try {
    await execa.shell(command, optsA)
  } catch (error) {
    const message = getErrorMessage({ error, command })
    throw new PluginError('gulp-execa', message)
  }
}

// Default to piping shell stdin|stdout|stderr to console.
const addStdio = function({ opts }) {
  // Unless user specified another stdio redirection.
  const hasStdioOption = STDIO_OPTIONS.some(
    stdioOption => opts[stdioOption] !== undefined,
  )

  if (hasStdioOption) {
    return opts
  }

  return { ...opts, stdio: 'inherit' }
}

const STDIO_OPTIONS = ['stdio', 'stdin', 'stdout', 'stderr']

// Retrieve error message to print
const getErrorMessage = function({
  error: { message, code, timedOut, signal },
  command,
}) {
  const description = getErrorDescription({ code, timedOut, signal })
  const trace = getErrorTrace({ message })
  const messageB = `Command '${command}' ${description} ${trace}`
  return messageB
}

const getErrorDescription = function({ code, timedOut, signal }) {
  if (timedOut) {
    return 'timed out'
  }

  if (signal !== null) {
    return `was killed with ${signal}`
  }

  return `failed with exit code ${code}`
}

const getErrorTrace = function({ message }) {
  if (message.startsWith(DEFAULT_MESSAGE)) {
    return ''
  }

  return `: ${message}`
}

// `execa` adds a default error message that we don't want because it includes
// full stdout|stderr, which should already printed on console
const DEFAULT_MESSAGE = 'Command failed: '

module.exports = exec
