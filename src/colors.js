import Chalk from 'chalk'

// Can disable colors with `opts.colors`.
// chalk will automatically disable colors if output does not support it.
export const addChalk = function(opts) {
  const chalk = getChalk(opts)
  return { ...opts, chalk }
}

const getChalk = function({ colors }) {
  return new Chalk.constructor({ enabled: colors })
}
