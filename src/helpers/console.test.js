import sinon from 'sinon'

// Spy on `console.error()`
// eslint-disable-next-line no-restricted-globals
export const getConsoleStub = () => sinon.stub(console, 'error')
