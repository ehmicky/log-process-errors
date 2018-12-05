'use strict'

const { mkdir, readFileSync, writeFile } = require('fs')
const { promisify } = require('util')

const { addScopeDirs } = require('./scope')

const TEMPLATE = readFileSync(`${__dirname}/template.js`, { encoding: 'utf-8' })

const pMkdir = promisify(mkdir)
const pWriteFile = promisify(writeFile)

// Add `{output}/node_modules/{file}.js` for each devDependency.
// The file simply throws an error.
// The goal is to check that the published module does not use devDependencies.
// Without create dummy `node_modules`, it would require `packageRoot`
// devDependencies, which are probably installed since they are needed for
// testing itself.
const addDevChecks = async function({ output }) {
  const nodeModules = await getNodeModules({ output })

  const devDependencies = getDevDependencies({ output })

  await addScopeDirs({ devDependencies, nodeModules })

  await Promise.all(
    devDependencies.map(name => addDevCheck({ name, nodeModules })),
  )
}

// Retrieve `{output}/node_modules`
const getNodeModules = async function({ output }) {
  const nodeModules = `${output}/node_modules`

  await pMkdir(nodeModules)

  return nodeModules
}

// Retrieve all `devDependencies` names.
const getDevDependencies = function({ output }) {
  // eslint-disable-next-line import/no-dynamic-require
  const { devDependencies = {} } = require(`${output}/package.json`)
  const devDependenciesA = Object.keys(devDependencies)
  return devDependenciesA
}

// Add the dependency file, based on a simple template file.
const addDevCheck = async function({ name, nodeModules }) {
  const devCheckFile = `${nodeModules}/${name}.js`
  const content = TEMPLATE.replace(TEMPLATE_TOKEN, name)
  await pWriteFile(devCheckFile, content, { encoding: 'utf-8' })
}

const TEMPLATE_TOKEN = 'DEPENDENCY'

module.exports = {
  addDevChecks,
}
