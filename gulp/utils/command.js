'use strict'

const { env } = require('process')
const { spawn } = require('child_process')

const PluginError = require('plugin-error')

// Execute a shell command
const execCommand = function(command, { quiet = false, cwd } = {}) {
  const [commandA, ...args] = command.trim().split(/ +/u)
  const envA = getEnv()
  const stdio = getStdio({ quiet })
  const child = spawn(commandA, args, { env: envA, stdio, cwd })

  // eslint-disable-next-line promise/avoid-new
  return new Promise(execCommandPromise.bind(null, { child, command }))
}

// Adds local Node modules binary to `$PATH`
const getEnv = function() {
  const PATH = getPath({ env })
  const envA = { ...env, PATH }
  return envA
}

const getPath = function({ env: { PATH = '' } }) {
  const hasLocalDir = PATH.split(':').includes(LOCAL_NODE_BIN_DIR)

  if (hasLocalDir) {
    return PATH
  }

  return `${PATH}:${LOCAL_NODE_BIN_DIR}`
}

const LOCAL_NODE_BIN_DIR = './node_modules/.bin/'

// If `opts.quiet` `true`, does not print stdout (but still prints stderr)
const getStdio = function({ quiet }) {
  if (quiet) {
    return [0, 'ignore', 2]
  }

  return 'inherit'
}

// Check command exit code
const execCommandPromise = function({ child, command }, resolve, reject) {
  child.on('exit', execCommandExit.bind(null, { command, resolve, reject }))
}

const execCommandExit = function({ command, resolve, reject }, exitCode) {
  if (exitCode === 0) {
    return resolve()
  }

  const error = new PluginError('shell', `Shell command '${command}' failed`)
  reject(error)
}

module.exports = {
  execCommand,
}
