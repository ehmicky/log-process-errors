import { stdout } from 'process'

import Chalk from 'chalk'

// Retrieve `chalk` instance.
// Allows forcing `colors` with `true` or `false` (default: guessed).
// Use `stdout.getColorDepth()` instead of chalk's default behavior (relying
// on `supports-color`) because it behaves more correctly.
export const getChalk = function ({ colors }) {
  const level = getLevel(colors)
  const chalk = new Chalk.Instance({ level })
  return chalk
}

const getLevel = function (colors) {
  if (colors === false) {
    return 0
  }

  const terminalLevel = getTerminalLevel()

  if (colors === undefined) {
    return terminalLevel
  }

  return Math.max(terminalLevel, 1)
}

const getTerminalLevel = function () {
  if (!stdout.isTTY) {
    return 0
  }

  return DEPTH_TO_LEVEL[stdout.getColorDepth()]
}

// Maps chalk levels to color depth
const DEPTH_TO_LEVEL = { 1: 0, 4: 1, 8: 2, 24: 3 }
