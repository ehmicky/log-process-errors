'use strict'

const assert = require('assert')

const { ensureDir } = require('fs-extra')

const { getBuildRoot } = require('./root')
const { getPackageHash } = require('./hash')

// Retrieve build directory paths.
// We must use a directory that is not a sibling or child so that requiring
// `devDependencies` fails.
// Filename is a concatenation of:
//  - `package.json` `name` + `dependencies` hash, for caching purpose
//  - `randomId` for parallel runs
// Those are returned as well.
const getBuildDir = async function({ packageRoot }) {
  const { buildRoot, name, hash, randomId } = await getBuildProperties({
    packageRoot,
  })

  // Tarball is moved to `buildBase` but extracted to `buildDir`
  const buildBase = `${buildRoot}/${name}--${hash}--${randomId}`
  const buildDir = `${buildBase}/package`

  await ensureDir(buildRoot)

  return { buildRoot, buildBase, buildDir, name, hash }
}

const getBuildProperties = async function({ packageRoot }) {
  // eslint-disable-next-line import/no-dynamic-require
  const packageJson = require(`${packageRoot}/package.json`)

  const [buildRoot, hash] = await Promise.all([
    getBuildRoot(),
    getPackageHash({ packageJson }),
  ])

  const name = getName({ packageJson })
  const randomId = getRandomId()

  return { buildRoot, name, hash, randomId }
}

const getName = function({ packageJson: { name } }) {
  // `npm pack` fails otherwise
  assert(name, "package.json 'name' field must be defined")

  return name
}

// We create a new directory for each run so that parallel runs do not conflict
const getRandomId = function() {
  return String(Math.random()).replace('.', '')
}

module.exports = {
  getBuildDir,
}
