'use strict'

const test = require('ava')
const execa = require('execa')

const { repeatEvents, normalizeMessage } = require('./helpers')

repeatEvents((prefix, { name }) => {
  test(`${prefix} should work using the -r flag`, async t => {
    const returnValue = await callLoader({ name, loader: 'simple' })

    t.snapshot(returnValue)
  })

  test(`${prefix} should work with --no-warnings`, async t => {
    const returnValue = await callLoader({
      name,
      loader: 'simple',
      flags: '--no-warnings',
    })

    t.snapshot(returnValue)
  })

  test(`${prefix} should work using both the -r flag and init()`, async t => {
    const returnValue = await callLoader({ name, loader: 'noop' })

    t.snapshot(returnValue)
  })
})

const callLoader = async function({ name, loader, flags = '' }) {
  const { stdout, stderr, code } = await execa.shell(
    `node ${flags} ${LOADERS[loader]} ${name}`,
    { reject: false },
  )

  const message = normalizeMessage(stderr)
  const stdoutA = normalizeMessage(stdout)

  return { code, message, stdout: stdoutA }
}

const LOADERS = {
  simple: `${__dirname}/helpers/simple_loader`,
  noop: `${__dirname}/helpers/noop_loader`,
}
