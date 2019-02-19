'use strict'

const stripAnsi = require('strip-ansi')

// Normalize console messages for testing
const normalizeMessage = function(message, { colors = true } = {}) {
  // Windows does not use colors on CI
  const messageA = colors ? message : stripAnsi(message)
  return messageA
    .replace(FIRST_SIGN_REGEXP, '[]')
    .replace(WARNING_PID_REGEXP, '(node:PID)')
    .replace(WARNING_OLD_REGEXP, '$1$2')
}

// The first sign in a console message is OS-dependent, so we remove it
const FIRST_SIGN_REGEXP = /^ [^ ]+/gmu
// Default Node.js warnings show PID, which we remove
const WARNING_PID_REGEXP = /\(node:\d+\)/u
// Default Node.js warnings <10 look different (no `code`, no `detail`)
// TODO: remove when Node.js <10 is not supported anymore
const WARNING_OLD_REGEXP = /(\(node:PID\)) \[[^\]]+\](.*)\n.*/u

module.exports = {
  normalizeMessage,
}
