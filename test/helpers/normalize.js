import { execaCommand } from 'execa'

// Call process and normalize its output for testing
export const normalizeCall = async function (input) {
  const { stdout, stderr, exitCode } = await execaCommand(input, {
    reject: false,
  })

  const stdoutA = normalizeMessage(stdout)
  const stderrA = normalizeMessage(stderr)
  return { exitCode, stdout: stdoutA, stderr: stderrA }
}

// Normalize console messages for testing
export const normalizeMessage = function (message) {
  const messageA = message.trim()
  const messageB = REPLACEMENTS.reduce(replacePart, messageA)
  return messageB
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
