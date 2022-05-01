import { execaCommand } from 'execa'
// TODO: use `util.stripVTControlCharacters()` after dropping support for
// Node <16.11.0
import stripAnsi from 'strip-ansi'

// Call process and normalize its output for testing
export const normalizeCall = async function (input, opts) {
  const { stdout, stderr, exitCode } = await execaCommand(input, {
    reject: false,
    ...opts,
  })

  const stdoutA = normalizeMessage(stdout, opts)
  const stderrA = normalizeMessage(stderr, opts)
  return { exitCode, stdout: stdoutA, stderr: stderrA }
}

// Normalize console messages for testing
export const normalizeMessage = function (message, { colors = true } = {}) {
  // Windows does not use colors on CI
  const messageA = colors ? message : stripAnsi(message)
  const messageB = messageA.trim()
  const messageC = REPLACEMENTS.reduce(replacePart, messageB)
  return messageC
}

const replacePart = function (message, [before, after]) {
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
  // Ava uses different symbols on Windows
  [/›/gu, '»'],
  // Stack traces
  [/^([ \t]+)at [^\r\n]+$/gmu, '$1at STACK TRACE'],
  [/(([ \t]+)at STACK TRACE(\r?\n)?)+/gu, '$2at STACK TRACE$3'],
  // Default Node.js warnings show PID, which we remove
  [/\(node:\d+\)/gu, '(node:PID)'],
  // Default Node.js warnings in >=14 show this additional warning
  [/\n.*--trace-warnings \.\.\..*/gu, ''],
  // File paths
  [/[^ (]+\/[^ )]+/gu, ''],
  // Durations in test runners:
  //  - Mocha, node_tap `classic` reporter
  [/ \([\d.]+m?s\)/gu, ''],
  //  - Jasmine
  [/[\d.]+ seconds?/gu, ''],
  //  - node_tap `classic` reporter
  [/ [\d.]+m?s/gu, ''],
  [/(line|column): \d+/gu, ''],
  [/ \.\. \s+/gu, ' .. '],
  //  - TAP
  [/time=[\d.]+m?s/gu, ''],
]
