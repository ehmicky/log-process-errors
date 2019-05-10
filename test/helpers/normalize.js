import execa from 'execa'
import stripAnsi from 'strip-ansi'

// Call process and normalize its output for testing
export const normalizeCall = async function(input, opts) {
  // TODO: remove once https://github.com/sindresorhus/execa/pull/182 is merged
  const [command, ...args] = input.split(' ')

  const { stdout, stderr, code } = await execa(command, args, {
    reject: false,
    ...opts,
  })

  const stdoutA = normalizeMessage(stdout)
  const stderrA = normalizeMessage(stderr)
  return { code, stdout: stdoutA, stderr: stderrA }
}

// Normalize console messages for testing
export const normalizeMessage = function(message, { colors = true } = {}) {
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
  [/✓/gu, '√'],
  [/✖/gu, '×'],
  [/◉/gu, '(*)'],
  [/ℹ/gu, 'i'],
  [/⚠/gu, '‼'],
  // Default Node.js warnings show PID, which we remove
  [/\(node:\d+\)/gu, '(node:PID)'],
  // Default Node.js warnings <10 look different (no `code`, no `detail`)
  // TODO: remove when Node.js <10 is not supported anymore
  [/(\(node:PID\)) \[[^\]]+\](.*)\n.*/gu, '$1$2'],
  // File paths
  [/[^ (]+\/[^ )]+/gu, ''],
  // Durations in test runners:
  //  - Mocha, node-tap `classic` reporter
  [/ \([\d.]+m?s\)/gu, ''],
  //  - Jasmine
  [/[\d.]+ seconds?/gu, ''],
  //  - Jasmine, Node 10 only (not Node 8 nor 12)
  [/\n\nSuite error: undefined/gu, ''],
  //  - node-tap `classic` reporter
  [/ [\d.]+m?s/gu, ''],
  [/(line|column): \d+/gu, ''],
  [/ \.\. \s+/gu, ' .. '],
  //  - TAP
  [/time=[\d.]+m?s/gu, ''],
]
