import sinon from 'sinon'

export const getConsoleStub = function () {
  // eslint-disable-next-line no-restricted-globals
  return sinon.stub(console, 'error')
}
