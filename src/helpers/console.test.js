import sinon from 'sinon'

// Spy on `console.error()`
export const getConsoleStub = function () {
  // eslint-disable-next-line no-restricted-globals
  return sinon.stub(console, 'error')
}
