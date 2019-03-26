'use strict'

const test = require('ava')
const execa = require('execa')

const { repeatEvents, normalizeMessage } = require('./helpers')

const SIMPLE_LOADER = `${__dirname}/helpers/simple_loader`
const NOOP_LOADER = `${__dirname}/helpers/noop_loader`

repeatEvents((prefix, { name }) => {
  test(`${prefix} should work using the -r flag`, async t => {
    const returnValue = await callLoader([SIMPLE_LOADER, name])

    t.snapshot(returnValue)
  })

  test(`${prefix} should work with --no-warnings`, async t => {
    const returnValue = await callLoader([SIMPLE_LOADER, name, '--no-warnings'])

    t.snapshot(returnValue)
  })

  test(`${prefix} should work using both the -r flag and init()`, async t => {
    const returnValue = await callLoader([NOOP_LOADER, name])

    t.snapshot(returnValue)
  })
})

const callLoader = async function(args) {
  const { stdout, stderr, code } = await execa('node', args, { reject: false })

  const stdoutA = normalizeMessage(stdout)
  const stderrA = normalizeMessage(stderr)
  return { code, stdout: stdoutA, stderr: stderrA }
}
