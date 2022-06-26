import avaConfig from '@ehmicky/dev-tasks/ava.config.js'

export default {
  ...avaConfig,
  environmentVariables: { NODE_OPTIONS: '' },
}
