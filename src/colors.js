import Chalk from 'chalk'

// Can disable colors with `opts.colors`.
// chalk will automatically disable colors if output does not support it.
export const addChalk = function({ opts, opts: { colors } }) {
  const chalk = new Chalk.constructor({ enabled: colors })
  return { ...opts, chalk }
}
