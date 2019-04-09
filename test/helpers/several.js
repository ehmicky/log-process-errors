// Emit several emits in parallel
export const emitEvents = async function(maxEvents, emitEvent) {
  const array = new Array(maxEvents).fill().map(() => emitEvent())
  await Promise.all(array)
}
