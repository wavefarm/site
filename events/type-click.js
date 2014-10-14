var api = require('../api')
var url = require('url')


module.exports = function (ev) {
  if (ev.metaKey || ev.ctrlKey || ev.shiftKey) return
  ev.preventDefault()

  var link = ev.currentTarget.href
  var params = url.parse(link, true).query

  state.archive.params.set(params)
  state.title.set('Search' + (params.q ? ' for ' + params.q : ''))

  api.search(params, function (err, results) {
    if (err) return console.error(err)
    state.archive.item.set(null)
    state.archive.results.set(results)
    history.pushState(window.state(), '', link)
  })
}
