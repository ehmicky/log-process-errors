import Chalk from 'chalk'
import { stdout as supportsColor } from 'supports-color'

// Can disable colors with `opts.colors`.
// chalk will automatically disable colors if output does not support it.
export const addChalk = function ({ opts, opts: { colors } }) {
  const level = getLevel(colors)
  const chalk = new Chalk.Instance({ level })
  return { ...opts, chalk }
}

const getLevel = function (colors) {
  if (!colors) {
    return 0
  }

  return Math.max(supportsColor.level, 1)
}

export const DEFAULT_COLORS = Boolean(supportsColor)
