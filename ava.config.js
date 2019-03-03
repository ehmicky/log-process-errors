import config from 'gulp-shared-tasks/ava.config'

export default {
  ...config,
  // Tests are setting listeners on `process` and stubbing global
  // `process.exit`, `console`, `setTimeout` and `Error.prepareStackTrace`,
  // so we cannot parallelize them.
  serial: true,
}
