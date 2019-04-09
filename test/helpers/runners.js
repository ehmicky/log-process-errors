import { env } from 'process'

const { SPAWN_WRAP_SHIM_ROOT } = env

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
export const RUNNERS = [
  { name: 'ava', command: file => `ava ${file}` },

  { name: 'mocha', command: file => `mocha ${file}` },

  {
    name: 'jasmine',
    // Jasmine adds random seeds to output otherwise
    command: file => `jasmine --seed=0 ${file}`,
  },

  { name: 'tape', command: file => `tape ${file}` },

  {
    name: 'node-tap:classic',
    command: file => `tap -R=classic ${file.replace('node-tap', 'node_tap')}`,
    skip: usesSpawnWrap,
  },
  {
    name: 'node-tap:tap',
    command: file => `tap -R=tap ${file.replace('node-tap', 'node_tap')}`,
    skip: usesSpawnWrap,
  },
].filter(shouldKeep)
