'use strict'

// Does a cartesian product on several arrays
const cartesianProduct = function(combs, array, ...arrays) {
  const combsA = combs.map(comb => (Array.isArray(comb) ? comb : [comb]))

  if (!Array.isArray(array)) {
    return combsA
  }

  const combsB = combsA.flatMap(comb => arrayProduct({ comb, array }))
  return cartesianProduct(combsB, ...arrays)
}

const arrayProduct = function({ comb, array }) {
  return array.map(value => [...comb, value])
}

// Check if an array has duplicate items
const hasDuplicates = function(array) {
  return array.some((valueA, index) => isDuplicate({ array, valueA, index }))
}

const isDuplicate = function({ array, valueA, index }) {
  return array.slice(index + 1).some(valueB => valueB === valueA)
}

module.exports = {
  cartesianProduct,
  hasDuplicates,
}
