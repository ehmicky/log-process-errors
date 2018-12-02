'use strict'

// Check command is nyc
const isNyc = function({ command }) {
  const [mainCommand, subCommand] = command.trim().split(/\s+/u)
  return mainCommand === 'nyc' && !NYC_SUB_COMMANDS.includes(subCommand)
}

// We only patch top-level `nyc` not `nyc instrument`, etc.
const NYC_SUB_COMMANDS = ['check-coverage', 'report', 'instrument', 'merge']

module.exports = {
  isNyc,
}
