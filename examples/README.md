This directory contains examples of this library.

To execute them, first [install](../README.md#install) `log-process-errors`.
Then:

- for JavaScript files, run
  `node node_modules/log-process-errors/examples/FILE.js`.
- for command line files (Bash), run
  `bash node_modules/log-process-errors/examples/FILE.sh`.

You can edit the examples.

They can also be run directly
[in your browser](https://repl.it/@ehmicky/log-process-errors).

## Main usage

- How process errors look by default **without** `log-process-errors`:
  [JavaScript](before.js), [command line](before.sh).
- How process errors look **with**
  [`log-process-errors`](../docs/API.md#logprocesserrorsoptions):
  [JavaScript](after.js), [command line](after.sh).
- [Restoring](../docs/API.md#logprocesserrorsoptions) Node.js default behavior:
  [JavaScript](restore.js).

## Options

- [`log`](../docs/API.md#log): [JavaScript](log.js).
- [`level`](../docs/API.md#level): [JavaScript](level.js).
- [`exitOn`](../docs/API.md#exit): [JavaScript](exit.js).
- [`colors`](../docs/API.md#colors): [JavaScript](colors.js).
