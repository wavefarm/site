var api = require('../api')


module.exports = function (ev) {
  if (ev.metaKey || ev.ctrlKey || ev.shiftKey) return
  ev.preventDefault()
  api.get(ev.currentTarget.id, function (err, item) {
    if (err) return console.error(err)
    state.archive.q.set(null)
    state.archive.results.set(null)
    state.archive.item.set(item)
    state.title.set(item.main)
    history.pushState(state(), '', '/archive/' + item.id)
  })
}
