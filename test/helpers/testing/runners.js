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
      `tap --no-coverage --no-timeout ${file.replace('node-tap', 'node_tap')}`,
  },
  {
    title: 'node-tap:tap',
    command: file =>
      `tap -R=tap --no-coverage --no-timeout ${file.replace(
        'node-tap',
        'node_tap',
      )}`,
    env: { TAP_DIAG: '0' },
  },
]
