'use strict'

const {
  env: { SPAWN_WRAP_SHIM_ROOT },
} = require('process')

const shouldKeep = function({ skip }) {
  return skip === undefined || !skip()
}

// `spawn-wrap` monkey patches `child_process`. That library is used by `nyc`.
// This somehow impacts the output of `node-tap`. The best workaround we have
// found is to skip `node-tap` testing in CI (which uses `nyc`).
// Would be fixed if https://github.com/tapjs/node-tap/issues/497 is done.
const usesSpawnWrap = function() {
  return Boolean(SPAWN_WRAP_SHIM_ROOT)
}

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
    skip: usesSpawnWrap,
  },
  {
    name: 'node-tap:tap',
    testing: 'node-tap',
    command: helperFile =>
      `tap -R=tap ${helperFile.replace('node-tap', 'node_tap')}`,
    skip: usesSpawnWrap,
  },
].filter(shouldKeep)

module.exports = {
  RUNNERS,
}
