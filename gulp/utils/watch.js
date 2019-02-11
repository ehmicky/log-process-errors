'use strict'

const promisify = require('util.promisify')
const { watch, series, parallel } = require('gulp')

const FILES = require('../files')

// Returns a watch task
// E.g. with `tasks` `{ FORMAT: format }`, the `format` task will be fired
// everytime `FILES.FORMAT` is changed.
// If specified, `initialTask` is fired first
const getWatchTask = function(tasks, initialTask) {
  const watchTask = getWatchTasks(tasks)

  if (initialTask === undefined) {
    return watchTask
  }

  // Runs the task before watching
  // Using `ignoreInitial` chokidar option does not work because the task would
  // be marked as complete before the initial run.
  return series(initialTask, watchTask)
}

const getWatchTasks = tasks =>
  function watchTasks() {
    const promises = Object.entries(tasks).map(([type, task]) =>
      watchByType({ type, task }),
    )
    return Promise.all(promises)
  }

const watchByType = async function({ type, task }) {
  const taskA = Array.isArray(task) ? parallel(task) : task
  const watcher = watch(FILES[type], taskA)

  // Wait for watching to be setup to mark the `watch` task as complete
  await promisify(watcher.on.bind(watcher))('ready')
}

module.exports = {
  getWatchTask,
}
