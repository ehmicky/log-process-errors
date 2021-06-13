// We test each runner + reporter combination
export const RUNNERS = [
  { title: 'ava', command: (file) => `ava ${file}.js` },
  { title: 'mocha', command: (file) => `mocha ${file}.js` },
  // Jasmine adds random seeds to output otherwise
  {
    title: 'jasmine',
    command: (file) => `jasmine --seed=0 ${file}.mjs`,
  },
  { title: 'tape', command: (file) => `node ${file}.js` },
  // {
  //   title: 'node-tap:default',
  //   command: (file) =>
  //     `tap --no-coverage --no-timeout ${file.replace(
  //       'node-tap',
  //       'node_tap',
  //     )}.js`,
  // },
  // {
  // title: 'node-tap:tap',
  // command: (file) =>
  //     `tap -R=tap --no-coverage --no-timeout ${file.replace(
  //       'node-tap',
  //       'node_tap',
  //     )}.js`,
  // env: { TAP_DIAG: '0' },
  // },
]
