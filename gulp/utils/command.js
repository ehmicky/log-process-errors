'use strict'

const { env } = require('process')
const { promisify } = require('util')

const spawn = require('cross-spawn')
const { get: getPath, PATH } = require('npm-path')
const PluginError = require('plugin-error')

// Execute a shell command
const execCommand = async function(command, { quiet = false, cwd } = {}) {
  const [commandA, ...args] = command.trim().split(/ +/u)
  const stdio = getStdio({ quiet })
  const envA = await getEnv()
  const child = spawn(commandA, args, { env: envA, stdio, cwd })

  // eslint-disable-next-line promise/avoid-new
  return new Promise(execCommandPromise.bind(null, { child, command }))
}

// Allow executing binaries installed in `node_modules/.bin`
const getEnv = async function() {
  const path = await promisify(getPath)()
  return { ...env, [PATH]: path }
}

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
