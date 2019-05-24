import { env } from 'process'

const { SPAWN_WRAP_SHIM_ROOT } = env

// `spawn-wrap` monkey patches `child_process`. That library is used by `nyc`.
// This somehow impacts the output of `node-tap`. The best workaround we have
// found is to skip `node-tap` testing in CI (which uses `nyc`).
// Would be fixed if https://github.com/tapjs/node-tap/issues/497 is done.
const shouldKeep = function({ name }) {
  return !(name.startsWith('node-tap') && SPAWN_WRAP_SHIM_ROOT)
}

// We test each runner + reporter combination
export const RUNNERS = [
  { name: 'ava', command: file => `ava ${file}` },
  { name: 'mocha', command: file => `mocha ${file}` },
  // Jasmine adds random seeds to output otherwise
  { name: 'jasmine', command: file => `jasmine --seed=0 ${file}` },
  { name: 'tape', command: file => `tape ${file}` },
  {
    name: 'node-tap:default',
    command: file =>
      `tap --no-coverage ${file.replace('node-tap', 'node_tap')}`,
  },
  {
    name: 'node-tap:tap',
    command: file =>
      `tap -R=tap --no-coverage ${file.replace('node-tap', 'node_tap')}`,
    env: { TAP_DIAG: '0' },
  },
]
  .filter(shouldKeep)
