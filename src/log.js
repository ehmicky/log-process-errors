// Default `opts.log`
// Note that `console` should be referenced inside this function, not outside,
// as user might monkey patch it.
export const defaultLog = function (error) {
  // eslint-disable-next-line no-restricted-globals, no-console
  console.error(error)
}
