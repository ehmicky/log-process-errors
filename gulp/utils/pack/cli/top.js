'use strict'

const yargs = require('yargs')

const defineCli = function() {
  return yargs
    .usage(USAGE)
    .example(EXAMPLE, 'Run tests')
    .help()
    .version()
    .strict()
}

const USAGE = `$0 COMMAND

Test a Node.js module after packing it.`

const EXAMPLE = '$0 npm test'

module.exports = {
  defineCli,
}
