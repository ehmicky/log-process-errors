// We test each runner + reporter combination
export const RUNNERS = [
  { title: 'ava', runner: 'ava', command: (file) => `ava ${file}.js` },
  { title: 'mocha', runner: 'mocha', command: (file) => `mocha ${file}.js` },
  // Jasmine adds random seeds to output otherwise
  {
    title: 'jasmine',
    runner: 'jasmine',
    command: (file) => `jasmine --seed=0 ${file}.mjs`,
  },
  { title: 'tape', runner: 'tape', command: (file) => `node ${file}.js` },
  // TODO: re-enable tests for node_tap
  // {
  //   title: 'node_tap:default',
  //   runner: 'node_tap',
  //   command: (file) => `tap --no-coverage --no-timeout ${file}.js`,
  // },
  // {
  //   title: 'node_tap:tap',
  //   runner: 'node_tap',
  //   command: (file) => `tap --no-coverage --no-timeout -R=tap ${file}.js`,
  //   env: { TAP_DIAG: '0' },
  // },
]
