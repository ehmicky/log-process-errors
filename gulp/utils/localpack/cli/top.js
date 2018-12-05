'use strict'

const yargs = require('yargs')

const defineCli = function() {
  return yargs
    .options(CONFIG)
    .usage(USAGE)
    .example(EXAMPLE, 'Run on current project')
    .help()
    .version()
    .strict()
}

const CONFIG = {
  output: {
    string: true,
    alias: 'o',
    requiresArg: true,
    describe: 'Where to unpack the package (default: {packageRoot}/package/)',
  },
}

const USAGE = `$0

Test how your module will be published to npm, by unpacking it locally.`

const EXAMPLE = '$0'

module.exports = {
  defineCli,
}
