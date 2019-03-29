'use strict'

// We test each runner + reporter combination
const RUNNERS = [
  { name: 'ava', testing: 'ava', command: helperFile => `ava ${helperFile}` },

  {
    name: 'mocha',
    testing: 'mocha',
    command: helperFile => `mocha ${helperFile}`,
  },

  // Jasmine adds random seeds to output otherwise
  {
    name: 'jasmine',
    testing: 'jasmine',
    command: helperFile => `jasmine --seed=0 ${helperFile}`,
  },

  {
    name: 'node-tap:classic',
    testing: 'node-tap',
    command: helperFile =>
      `tap -R=classic ${helperFile.replace('node-tap', 'node_tap')}`,
  },
]

module.exports = {
  RUNNERS,
}
