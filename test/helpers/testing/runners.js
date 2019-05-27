import { env } from 'process'

const { SPAWN_WRAP_SHIM_ROOT } = env

// We test each runner + reporter combination
export const RUNNERS = [
  { title: 'ava', command: file => `ava ${file}` },
  { title: 'mocha', command: file => `mocha ${file}` },
  // Jasmine adds random seeds to output otherwise
  { title: 'jasmine', command: file => `jasmine --seed=0 ${file}` },
  { title: 'tape', command: file => `tape ${file}` },
  {
    title: 'node-tap:default',
    command: file =>
      `tap --no-coverage ${file.replace('node-tap', 'node_tap')}`,
  },
  {
    title: 'node-tap:tap',
    command: file =>
      `tap -R=tap --no-coverage ${file.replace('node-tap', 'node_tap')}`,
    env: { TAP_DIAG: '0' },
  },
]
  // `spawn-wrap` monkey patches `child_process`. That library is used by `nyc`.
  // This somehow impacts the output of `node-tap`. The best workaround we have
  // found is to skip `node-tap` testing in CI (which uses `nyc`).
  // Would be fixed if https://github.com/tapjs/node-tap/issues/497 is done.
  .filter(({ title }) => !(title.startsWith('node-tap') && SPAWN_WRAP_SHIM_ROOT))
