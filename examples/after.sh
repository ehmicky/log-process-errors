#!/usr/bin/env bash
# Demonstrates how process errors look **with** `log-process-errors`,
# in the terminal (Bash).
# This file can be directly run:
#   - first install `log-process-errors`
#   - then `bash node_modules/log-process-errors/examples/after.sh`
# An online demo is also available at:
#   https://repl.it/@ehmicky/log-process-errors

examplesDir="$(dirname "$BASH_SOURCE")"

# Emits different types of process errors.
node "$examplesDir/after.js"
