import { stub } from 'sinon'

// Spy on `console.error()`
// eslint-disable-next-line no-restricted-globals
export const getConsoleStub = () => stub(console, 'error')
