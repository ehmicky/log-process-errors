'use strict'

const stripAnsi = require('strip-ansi')

// Normalize console messages for testing
const normalizeMessage = function(message, { colors = true } = {}) {
  // Windows does not use colors on CI
  const messageA = colors ? message : stripAnsi(message)
  return (
    messageA
      // Our library and ava prints the symbol before test names differently
      // on Windows
      .replace(new RegExp('✔', 'gu'), '√')
      .replace(new RegExp('✖', 'gu'), '×')
      .replace(new RegExp('◉', 'gu'), '(*)')
      .replace(new RegExp('ℹ', 'gu'), 'i')
      .replace(WARNING_PID_REGEXP, '(node:PID)')
      .replace(WARNING_OLD_REGEXP, '$1$2')
  )
}

// Default Node.js warnings show PID, which we remove
const WARNING_PID_REGEXP = /\(node:\d+\)/u
// Default Node.js warnings <10 look different (no `code`, no `detail`)
// TODO: remove when Node.js <10 is not supported anymore
const WARNING_OLD_REGEXP = /(\(node:PID\)) \[[^\]]+\](.*)\n.*/u

module.exports = {
  normalizeMessage,
}
