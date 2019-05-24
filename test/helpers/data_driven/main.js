import { getPrefixes } from './prefix.js'
import { cartesianProduct } from './utils.js'

// Repeat a function with a combination of arguments.
// Meant for test-driven development.
// One of the design goals is to be separate from the test framework:
//  - this can be applied to any test library, not just ava
//  - this does not require patching test framework functions, which usually
//    gets in the way of linting such as `eslint-plugin-ava`
// TODO: extract this library
//  - check other data-driven test libraries for features
//  - allow values to be generating functions
export const testEach = function(...args) {
  const arrays = args.slice(0, -1)
  const func = args[args.length - 1]

  const arraysA = cartesianProduct(...arrays)

  const prefixes = getPrefixes(arraysA)

  return arraysA.map((values, index) =>
    func({ name: prefixes[index] }, ...values),
  )
}
