'use strict'

// The first sign in a console message is OS-dependent, so we remove it
const normalizeMessage = function(message) {
  return message.replace(/[^ ]/u, '[]')
}

module.exports = {
  normalizeMessage,
}
