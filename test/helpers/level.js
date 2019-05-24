// Required directly because this is exposed through documentation, but not
// through code
import { LEVELS } from '../../src/level.js'

const isNormalLevel = function(level) {
  return level !== 'silent' && level !== 'default'
}

export const NORMAL_LEVELS = LEVELS.filter(isNormalLevel)
