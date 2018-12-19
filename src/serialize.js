'use strict'

const { inspect } = require('util')

// We use `util.inspect()` instead of `JSON.stringify()` or a third-party
// library because it has nice output.
const serialize = function(value) {
  if (value instanceof Error) {
    return value.stack
  }

  return inspect(value, INSPECT_OPTS)
}

// Default `depth` changes from Node.js 11.0 to 11.3
const INSPECT_OPTS = { depth: 2, getters: true }

// This is meant when serialization must be predictable.
// We use `util.inspect()` instead of `JSON.stringify()` to support more
// types and circular references.
// `sorted` prevents the same event using different keys order from having
// a different fingerprint. It is only `Node.js 10` but is backward-compatible
// Big arrays, objects or buffers will be truncated, which makes this call
// less CPU-intensive and the result value smaller in memory. However it
// introduces higher risk of false positives (event being flagged as repeated
// even though it's different). Process errors should be exceptional, so this
// is ok.
const stableSerialize = function(value) {
  return inspect(value, STABLE_INSPECT_OPTS)
}

const STABLE_INSPECT_OPTS = { ...INSPECT_OPTS, sorted: true }

module.exports = {
  serialize,
  stableSerialize,
}
