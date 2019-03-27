'use strict'

const execa = require('execa')
const stripAnsi = require('strip-ansi')

// Call process and normalize its output for testing
const normalizeCall = async function(command, args, opts) {
  const { stdout, stderr, code } = await execa(command, args, {
    reject: false,
    ...opts,
  })

  const stdoutA = normalizeMessage(stdout)
  const stderrA = normalizeMessage(stderr)
  return { code, stdout: stdoutA, stderr: stderrA }
}

// Normalize console messages for testing
const normalizeMessage = function(message, { colors = true } = {}) {
  // Windows does not use colors on CI
  const messageA = colors ? message : stripAnsi(message)
  const messageB = messageA.trim()
  const messageC = REPLACEMENTS.reduce(replacePart, messageB)
  return messageC
}

const replacePart = function(message, [before, after]) {
  return message.replace(before, after)
}

const REPLACEMENTS = [
  // Windows specifics
  [/\r\n/gu, '\n'],
  [/\\/gu, '/'],
  // Our library and ava prints the symbol before test names differently
  // on Windows
  [/✔/gu, '√'],
  [/✖/gu, '×'],
  [/◉/gu, '(*)'],
  [/ℹ/gu, 'i'],
  [/⚠/gu, '‼'],
  // Default Node.js warnings show PID, which we remove
  [/\(node:\d+\)/gu, '(node:PID)'],
  // Default Node.js warnings <10 look different (no `code`, no `detail`)
  // TODO: remove when Node.js <10 is not supported anymore
  [/(\(node:PID\)) \[[^\]]+\](.*)\n.*/gu, '$1$2'],
]

module.exports = {
  normalizeCall,
  normalizeMessage,
}
