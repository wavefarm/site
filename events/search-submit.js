var api = require('../api')
var qs = require('querystring')
var ve = require('value-event/value')


module.exports = ve(function (params) {
  var state = window.state

  var q = params.q
  var date = params.date
  var date2 = params.date2
  state.archive.params.set(params)
  state.title.set('Search for ' + q)
  api.search(params, function (err, results) {
    if (err) return console.error(err)
    state.archive.item.set(null)
    state.archive.results.set(results)
    history.pushState(window.state(), '', '/archive?' + qs.stringify(params))
  })
})
