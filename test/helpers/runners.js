import { env } from 'process'

const { SPAWN_WRAP_SHIM_ROOT } = env

// `spawn-wrap` monkey patches `child_process`. That library is used by `nyc`.
// This somehow impacts the output of `node-tap`. The best workaround we have
// found is to skip `node-tap` testing in CI (which uses `nyc`).
// Would be fixed if https://github.com/tapjs/node-tap/issues/497 is done.
const shouldKeep = function({ runner }) {
  return !(runner.startsWith('node-tap') && SPAWN_WRAP_SHIM_ROOT)
}

const addName = function({ runner, ...runnerInfo }) {
  return { ...runnerInfo, runner, name: runner }
}

// We test each runner + reporter combination
export const RUNNERS = [
  { runner: 'ava', command: file => `ava ${file}` },
  { runner: 'mocha', command: file => `mocha ${file}` },
  {
    runner: 'jasmine',
    // Jasmine adds random seeds to output otherwise
    command: file => `jasmine --seed=0 ${file}`,
  },
  { runner: 'tape', command: file => `tape ${file}` },
  {
    runner: 'node-tap:default',
    command: file =>
      `tap --no-coverage ${file.replace('node-tap', 'node_tap')}`,
  },
  {
    runner: 'node-tap:tap',
    command: file =>
      `tap -R=tap --no-coverage ${file.replace('node-tap', 'node_tap')}`,
    env: { TAP_DIAG: '0' },
  },
]
  .filter(shouldKeep)
  .map(addName)
